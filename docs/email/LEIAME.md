# E-mail de confirmação de cadastro do StockFlow

Arquivo do template: `confirmar-cadastro.html`
Assunto: **Confirme seu e-mail para acessar o StockFlow**

O link do botão é gerado pelo próprio Supabase (`{{ .ConfirmationURL }}`). O template não cria
token nenhum e não contém chave nem senha. O único endereço fixo dentro dele é o da imagem do
logotipo (`https://stockflow01-main.vercel.app/apple-touch-icon.png`). Se o domínio mudar, troque
essa linha.

## Antes de tudo: o painel só deixa editar o template com SMTP próprio

No painel do projeto (Authentication → Emails → Templates) aparece o aviso
"Set up custom SMTP to edit templates". Ou seja: **enquanto não houver SMTP próprio, o Supabase
envia o e-mail padrão e não deixa trocar assunto nem corpo.** Isso também vale para o limite de
envios: o serviço padrão do Supabase é só para testes (poucos e-mails por hora).

Para usar este template e receber clientes de verdade, é preciso configurar um servidor de e-mail
(SMTP) em Authentication → Emails → SMTP Settings. Há serviços com plano gratuito (por exemplo
Resend e Brevo), mas eles costumam pedir um domínio próprio verificado. Domínio tem custo. Confira
os limites e preços atuais antes de decidir. Nada disso foi contratado.

## 1. Conferir as URLs (Authentication → URL Configuration)

- **Site URL:** `https://stockflow01-main.vercel.app` (já está assim).
- **Redirect URLs** (hoje está vazio). Clique em **Add URL** e adicione:
  - `https://stockflow01-main.vercel.app/auth/callback`
  - `http://localhost:8080/auth/callback` (para testar no seu computador)
  - Para os previews da Vercel, um curinga com o nome da sua conta ou equipe, que aparece no
    endereço dos previews: `https://*-SEU-NOME-NA-VERCEL.vercel.app/auth/callback`

Se o endereço de retorno não estiver na lista, o Supabase ignora o pedido e manda a pessoa para o
Site URL (a página inicial). Ela entra, mas não vê a tela "E-mail verificado!".

## 2. Colar o template (depois de configurar o SMTP)

1. Supabase → **Authentication → Emails → Templates → Confirm sign up**.
2. Em **Subject**, escreva: `Confirme seu e-mail para acessar o StockFlow`
3. Em **Message body**, escolha a visão de código (HTML/Source), apague o conteúdo e cole o
   arquivo `confirmar-cadastro.html` inteiro.
4. Clique em **Save**.
5. Envie um cadastro de teste para um e-mail seu e confira o resultado no computador e no celular.

## 3. Roteiro de teste manual

| # | O que fazer | Resultado esperado |
|---|-------------|--------------------|
| 1 | Cadastrar com um e-mail válido e senha de 8+ caracteres | Tela "Bem-vindo ao StockFlow!" com o e-mail parcialmente escondido. Nenhuma frase de conta confirmada. |
| 2 | Olhar o botão de reenvio | Desativado, com contagem de 60 s. |
| 3 | Esperar e clicar em reenviar | Indicador de carregamento, depois "Pedido de reenvio feito...". |
| 4 | Clicar em reenviar de novo logo em seguida | Botão desativado de novo, sem novo pedido. |
| 5 | Abrir o e-mail (computador e celular) | Marca StockFlow, botão azul "Confirmar meu e-mail", link alternativo e aviso de segurança. |
| 6 | Clicar em "Confirmar meu e-mail" | Tela "E-mail verificado!" e o botão "Acessar minha conta". |
| 7 | Clicar no mesmo link uma segunda vez | "Link expirado" (o link vale uma vez só). |
| 8 | Abrir `/auth/callback` direto, sem link | "Nada para confirmar aqui". Nunca "E-mail verificado!". |
| 9 | Desligar a internet e clicar no botão do e-mail | "Sem conexão", com "Tentar novamente". |
| 10 | Entrar com a conta confirmada, depois clicar em **Sair** | Volta para o login. |
| 11 | Cadastrar com senha curta ou fraca | Mensagem específica de senha. |
| 12 | Pedir vários e-mails em sequência | Mensagem de limite de solicitações. |

## 4. Problemas conhecidos e o que ainda não foi validado

- A aparência do e-mail nos clientes (Gmail, Outlook, Apple Mail) não foi verificada com e-mails reais.
- O logotipo é uma imagem externa. Alguns clientes bloqueiam imagens por padrão; por isso o nome
  "StockFlow" também está em texto ao lado dela.
- O Supabase não deixa distinguir "e-mail já cadastrado" de e-mail novo (proteção de privacidade).
  Por isso a tela de boas-vindas aparece igual nos dois casos, com o atalho para o login.
- Quem tenta entrar sem ter confirmado o e-mail ainda vê a mensagem genérica do login. Ajustar
  isso ficou fora deste escopo.
