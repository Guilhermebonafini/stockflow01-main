-- StockFlow, Etapa 0, migração 1 de 2.
-- PROPOSTA PARA REVISÃO. NÃO APLICADA.
-- Só adiciona coisas. Não apaga tabela, coluna nem dado.
-- Reversão: ver 20261023000100_etapa0_movimentacoes_rollback.sql

begin;

-- 1. Estoque mínimo por produto.
-- Padrão 5 = regra atual (LOW_STOCK_LIMIT). "Baixo" continua sendo quantity <= min_quantity.
alter table public.products
  add column if not exists min_quantity integer not null default 5
  check (min_quantity >= 0);

-- 2. Permite à movimentação provar que o produto é do mesmo usuário (chave estrangeira composta).
alter table public.products
  add constraint products_id_user_id_key unique (id, user_id);

-- 3. Tabela de movimentações.
-- product_name guarda o nome na hora do registro: o histórico sobrevive à exclusão do produto.
create table public.movements (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null default auth.uid(),
  product_id   uuid,
  product_name text not null check (char_length(product_name) between 1 and 120),
  type         text not null check (type in ('entrada', 'saida')),
  quantity     integer not null check (quantity > 0 and quantity <= 1000000),
  note         text not null default '' check (char_length(note) <= 120),
  created_at   timestamptz not null default now(),
  -- Produto e movimentação precisam ter o mesmo user_id.
  -- Ao excluir o produto, só product_id vira NULL (user_id é NOT NULL e fica).
  constraint movements_product_owner_fk
    foreign key (product_id, user_id)
    references public.products (id, user_id)
    on delete set null (product_id)
);

create index movements_user_created_idx on public.movements (user_id, created_at desc);
create index movements_product_idx on public.movements (product_id) where product_id is not null;

-- 4. RLS: usuário só lê as próprias movimentações.
-- Não existe política de INSERT, UPDATE nem DELETE: o cliente não grava direto.
-- A única porta de escrita é register_movement() (e a importação, na migração 2).
alter table public.movements enable row level security;

create policy "own select" on public.movements
  for select to authenticated
  using (auth.uid() = user_id);

-- 5. Permissões mínimas.
revoke all on public.movements from public, anon, authenticated;
grant select on public.movements to authenticated;
grant all on public.movements to service_role;

-- 6. Registrar movimentação e atualizar estoque na mesma transação.
-- SECURITY DEFINER é necessário porque o cliente não tem permissão de INSERT em movements.
-- Cuidados:
--   - search_path vazio: todo objeto é citado com schema (public., auth.).
--   - o usuário vem de auth.uid() (token validado). A função não recebe user_id.
--   - o produto é buscado com user_id = auth.uid() e travado (FOR UPDATE) contra saídas simultâneas.
--   - EXECUTE só para authenticated.
create or replace function public.register_movement(
  p_product_id uuid,
  p_type       text,
  p_quantity   integer,
  p_note       text default ''
)
returns public.movements
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid     uuid := auth.uid();
  v_product public.products%rowtype;
  v_move    public.movements%rowtype;
begin
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  if p_type is null or p_type not in ('entrada', 'saida') then
    raise exception 'invalid_type' using errcode = '22023';
  end if;
  if p_quantity is null or p_quantity <= 0 or p_quantity > 1000000 then
    raise exception 'invalid_quantity' using errcode = '22023';
  end if;

  select * into v_product
  from public.products
  where id = p_product_id and user_id = v_uid
  for update;

  if not found then
    raise exception 'product_not_found' using errcode = 'P0002';
  end if;

  if p_type = 'saida' and v_product.quantity < p_quantity then
    raise exception 'insufficient_stock'
      using errcode = 'P0001', detail = format('available=%s', v_product.quantity);
  end if;

  update public.products
  set quantity = quantity + case when p_type = 'entrada' then p_quantity else -p_quantity end
  where id = v_product.id and user_id = v_uid;

  insert into public.movements (user_id, product_id, product_name, type, quantity, note)
  values (v_uid, v_product.id, v_product.name, p_type, p_quantity,
          left(coalesce(btrim(p_note), ''), 120))
  returning * into v_move;

  return v_move;
end;
$$;

revoke all on function public.register_movement(uuid, text, integer, text) from public, anon;
grant execute on function public.register_movement(uuid, text, integer, text) to authenticated;

-- 7. Limpeza de permissões em products (separável: pode ser retirada se você preferir adiar).
-- anon tem hoje todos os privilégios, inclusive TRUNCATE. As políticas RLS só valem para
-- authenticated, então o app não usa nada disso. TRUNCATE ignora RLS, por isso é melhor remover.
revoke all on public.products from anon;
revoke truncate, references, trigger on public.products from authenticated;

commit;
