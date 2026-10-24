-- StockFlow, Etapa 0, migração 2 de 2.
-- PROPOSTA PARA REVISÃO. NÃO APLICADA. Depende da migração 1.
-- Importa produtos e movimentações vindos do localStorage, tudo ou nada, sem duplicar.

begin;

-- legacy_id = id que o registro tinha no navegador. Com ele, repetir a importação não duplica.
alter table public.products  add column if not exists legacy_id text check (char_length(legacy_id) <= 64);
alter table public.movements add column if not exists legacy_id text check (char_length(legacy_id) <= 64);

create unique index products_user_legacy_uidx
  on public.products (user_id, legacy_id) where legacy_id is not null;
create unique index movements_user_legacy_uidx
  on public.movements (user_id, legacy_id) where legacy_id is not null;

-- Cuidados (mesmos da register_movement):
--   - SECURITY DEFINER com search_path vazio; usuário vem de auth.uid(), nunca do parâmetro.
--   - valida tudo; qualquer registro inválido faz a função inteira falhar e desfaz tudo.
--   - limites de tamanho para evitar abuso.
--   - importa as quantidades como estão e NÃO recalcula estoque a partir do histórico.
create or replace function public.import_local_data(p_products jsonb, p_movements jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid       uuid := auth.uid();
  v_item      jsonb;
  v_pid       uuid;
  v_rows      integer;
  v_prod_new  integer := 0;
  v_prod_skip integer := 0;
  v_mov_new   integer := 0;
  v_mov_skip  integer := 0;
  v_type      text;
  v_qty       numeric;
  v_price     numeric;
begin
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  if jsonb_typeof(p_products) is distinct from 'array'
     or jsonb_typeof(p_movements) is distinct from 'array' then
    raise exception 'invalid_payload' using errcode = '22023';
  end if;
  if jsonb_array_length(p_products) > 2000 or jsonb_array_length(p_movements) > 20000 then
    raise exception 'payload_too_large' using errcode = '22023';
  end if;

  for v_item in select * from jsonb_array_elements(p_products) loop
    v_price := (v_item ->> 'price')::numeric;
    v_qty   := (v_item ->> 'quantity')::numeric;
    if coalesce(char_length(btrim(v_item ->> 'name')), 0) not between 1 and 120
       or coalesce(char_length(btrim(v_item ->> 'category')), 0) not between 1 and 60
       or coalesce(char_length(v_item ->> 'id'), 0) not between 1 and 64
       or v_price is null or v_price < 0
       or v_qty is null or v_qty < 0 or v_qty <> trunc(v_qty) or v_qty > 2000000000 then
      raise exception 'invalid_product' using errcode = '22023', detail = coalesce(v_item ->> 'id', '?');
    end if;

    insert into public.products (user_id, name, category, price, quantity, legacy_id)
    values (v_uid, btrim(v_item ->> 'name'), btrim(v_item ->> 'category'),
            v_price, v_qty::integer, v_item ->> 'id')
    on conflict (user_id, legacy_id) where legacy_id is not null do nothing;
    get diagnostics v_rows = row_count;
    if v_rows = 1 then v_prod_new := v_prod_new + 1; else v_prod_skip := v_prod_skip + 1; end if;
  end loop;

  for v_item in select * from jsonb_array_elements(p_movements) loop
    v_type := v_item ->> 'type';
    v_qty  := (v_item ->> 'quantity')::numeric;
    if coalesce(char_length(btrim(v_item ->> 'productName')), 0) not between 1 and 120
       or coalesce(char_length(v_item ->> 'id'), 0) not between 1 and 64
       or v_type is null or v_type not in ('entrada', 'saida')
       or v_qty is null or v_qty <= 0 or v_qty <> trunc(v_qty) or v_qty > 1000000
       or coalesce(char_length(v_item ->> 'note'), 0) > 120 then
      raise exception 'invalid_movement' using errcode = '22023', detail = coalesce(v_item ->> 'id', '?');
    end if;

    -- Produto já excluído no navegador: a movimentação entra sem vínculo (product_id nulo).
    select id into v_pid
    from public.products
    where user_id = v_uid and legacy_id = v_item ->> 'productId';

    insert into public.movements
      (user_id, product_id, product_name, type, quantity, note, created_at, legacy_id)
    values (v_uid, v_pid, btrim(v_item ->> 'productName'), v_type, v_qty::integer,
            coalesce(v_item ->> 'note', ''),
            (v_item ->> 'createdAt')::timestamptz, v_item ->> 'id')
    on conflict (user_id, legacy_id) where legacy_id is not null do nothing;
    get diagnostics v_rows = row_count;
    if v_rows = 1 then v_mov_new := v_mov_new + 1; else v_mov_skip := v_mov_skip + 1; end if;
  end loop;

  return jsonb_build_object(
    'products_imported', v_prod_new,  'products_skipped', v_prod_skip,
    'movements_imported', v_mov_new,  'movements_skipped', v_mov_skip
  );
end;
$$;

revoke all on function public.import_local_data(jsonb, jsonb) from public, anon;
grant execute on function public.import_local_data(jsonb, jsonb) to authenticated;

commit;
