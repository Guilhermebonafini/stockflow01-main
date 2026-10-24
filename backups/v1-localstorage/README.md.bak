# StockFlow — MVP de controle de estoque

Aplicação web para pequenos negócios acompanharem produtos e movimentações de estoque. Esta versão é um MVP de aprendizado: os dados ficam no `localStorage` do navegador e não são sincronizados entre dispositivos ou usuários.

## Funcionalidades

- Painel com total de produtos, unidades, valor do estoque e itens com estoque baixo.
- Cadastro, edição, exclusão, pesquisa e filtro de produtos.
- Registro de entradas e saídas, com validação para não permitir saída maior que o estoque disponível.
- Histórico de movimentações.
- Exportação da lista de produtos para CSV.
- Salvamento local no navegador.

## Requisitos

- Node.js 22 ou versão LTS recente compatível.
- npm.

## Executar no VS Code

1. Extraia o ZIP e abra a pasta `stockflow01-main` no VS Code.
2. Abra o terminal integrado (`Terminal > New Terminal`).
3. Instale as dependências:

   ```bash
   npm install
   ```

4. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

5. Abra o endereço local mostrado no terminal (normalmente `http://localhost:3000` ou `http://localhost:5173`).

## Estrutura principal

- `src/routes/index.tsx`: página principal, navegação, dashboard, produtos e movimentações.
- `src/components/ProductForm.tsx`: formulário de criação e edição de produtos.
- `src/data/products.ts`: tipo de produto, dados de demonstração e formatação de moeda.
- `src/styles.css`: tokens visuais e estilos globais.

## Limitações importantes

- Os dados ficam somente no navegador atual. Limpar os dados do site pode apagá-los.
- Não há login, equipe, sincronização em nuvem nem isolamento por empresa nesta versão.
- Não use dados sensíveis ou dados comerciais reais importantes até integrar um banco de dados e autenticação seguros.
- A próxima etapa recomendada é integrar Supabase com políticas de Row Level Security (RLS) e testar as permissões antes de disponibilizar para clientes.

## Páginas

| Rota | Página |
| --- | --- |
| `/` | Início: indicadores, estoque baixo e movimentações recentes |
| `/produtos` | Cadastro, edição, busca e filtro por categoria |
| `/movimentacoes` | Histórico e registro de entradas e saídas |
| `/relatorios` | Posição do estoque, movimentações e estoque baixo, com filtros, gráficos e exportação CSV |
| `/pdv` | Em desenvolvimento |
| `/configuracoes` | Gerenciar os dados salvos no navegador |

## Estrutura do código

- `src/lib/stock-store.tsx`: dados (produtos e movimentações) compartilhados por todas as páginas. É o único lugar que fala com o `localStorage`; ao migrar para o banco online, a troca acontece aqui.
- `src/lib/reports.ts`: filtros, cálculos e CSV dos relatórios. Para criar um relatório novo, adicione uma definição em `REPORTS`.
- `src/components/AppShell.tsx`: menu lateral (notebook e tablet), barra superior e menu inferior (celular).

## Testes

```bash
npm test
```
