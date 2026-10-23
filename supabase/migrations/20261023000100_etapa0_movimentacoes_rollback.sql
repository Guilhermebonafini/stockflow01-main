-- StockFlow, Etapa 0: REVERSÃO. NÃO é uma migração automática: rode à mão, só se precisar.
-- ATENÇÃO: apagar public.movements APAGA o histórico gravado nela. Antes, exporte:
--   select * from public.movements;   (salve como CSV no painel do Supabase)
-- Os produtos e as quantidades não são apagados por este script.

begin;

drop function if exists public.import_local_data(jsonb, jsonb);
drop function if exists public.register_movement(uuid, text, integer, text);

drop table if exists public.movements;

drop index if exists public.products_user_legacy_uidx;
alter table public.products drop column if exists legacy_id;

alter table public.products drop constraint if exists products_id_user_id_key;
alter table public.products drop column if exists min_quantity;

-- As permissões removidas de anon/authenticated em products não precisam voltar:
-- o app nunca dependeu delas.

commit;
