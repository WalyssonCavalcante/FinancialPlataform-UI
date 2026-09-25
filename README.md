# UI da Plataforma Financeira

A aplicação web em Angular da Plataforma Financeira. O sistema oferece um painel onde o usuário pode acompanhar receitas e despesas, configurar limites mensais de gastos e gerenciar seu perfil.

<img width="1919" height="944" alt="image" src="https://github.com/user-attachments/assets/4dcc3ce1-24ff-405b-82a9-8d976ef5aa93" />
<img width="1919" height="945" alt="image" src="https://github.com/user-attachments/assets/7e27cff6-cefb-441b-aed5-731d3db16a6c" />

## Arquitetura

O front-end foi construído com Angular, organizado em torno de componentes *standalone*.

- Core - Serviços que rodam em toda a aplicação, como o gerenciador de temas (Dark/Light mode) e guardas de rota
- Shared - Componentes visuais reutilizáveis, como o menu lateral (Sidebar) e o layout principal
- Features - As telas principais do sistema (Dashboard, Login, Configurações)
- Styles - Variáveis globais em SCSS e tipografia base

## Estrutura do Projeto

```text
financial-platform-ui/
├── src/
│   ├── app/
│   │   ├── core/          # Serviços essenciais e gestão de estado
│   │   ├── shared/        # Componentes de layout (Sidebar, etc)
│   │   ├── features/      # Telas (Dashboard, Auth, Settings, Limits)
│   │   └── app.routes.ts  # Configuração de rotas
│   ├── assets/            # Imagens, ícones e arquivos estáticos
│   └── styles.scss        # Variáveis de tema e estilos globais
```

## Pré-requisitos

- Node.js 18 ou superior
- Angular CLI

## Instalação

Para baixar as dependências do projeto, execute:

```bash
npm install
```

## Uso

Inicie o servidor de desenvolvimento:

```bash
ng serve
```

Acesse `http://localhost:4200/` no navegador. A aplicação recarrega automaticamente caso algum arquivo seja alterado.

## Funcionalidades

- **Autenticação:** Login e criação de conta integrados com a API.
- **Dashboard:** Visão geral da saúde financeira do usuário.
- **Lançamentos:** Registro de novas receitas e despesas.
- **Limites:** Definição e acompanhamento dos limites mensais de gastos por categoria.
- **Configurações:** Edição de dados do perfil e personalização do tema (Claro/Escuro).
