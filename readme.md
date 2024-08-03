## Adapt Control - API 🚀

<div align="center">

  ![Static Badge](https://img.shields.io/badge/Node-0A9047?style=for-the-badge&logo=node.js&labelColor=black)
  ![Static Badge](https://img.shields.io/badge/fastify-000000?style=for-the-badge&logo=fastify&logoColor=white&labelColor=black)
  ![Static Badge](https://img.shields.io/badge/typescript-0B88F7?style=for-the-badge&logo=typescript&logoColor=0B88F7&labelColor=black)
  ![Static Badge](https://img.shields.io/badge/prisma-063E7C?style=for-the-badge&logo=prisma&logoColor=white&labelColor=black)
  ![Static Badge](https://img.shields.io/badge/MySQL-0B7FAA?style=for-the-badge&logo=mysql&logoColor=%23000&labelColor=orange)
  ![Static Badge](https://img.shields.io/badge/ZOD-0822A2?style=for-the-badge&logo=zod&logoColor=%23000&labelColor=1481FC)
  ![Static Badge](https://img.shields.io/badge/dotenv-D0D302?style=for-the-badge&logo=.env&logoColor=D0D302&labelColor=black)
  ![Static Badge](https://img.shields.io/badge/yarn-0B80BB?style=for-the-badge&logo=yarn&logoColor=white&labelColor=0B80BB)

</div>

Este projeto é uma API desenvolvida utilizando **[Node](https://nodejs.org/en), [Fastify](https://fastify.dev/), [Typescript](https://www.typescriptlang.org/), [Prisma](https://www.prisma.io/), [ZOD](https://zod.dev/) and [MySQL](https://www.mysql.com/) como Banco de dados.** 

A API simula as funcionalidades para controlar um comércio, seja um Mercado, Loja ou equivalente. Usuários podem registrar produtos, categorias, vendas e verificar como está fluindo o estoque de produtos.

#### Tabela de conteúdo

- [Instalação](#instalação)
- [Configuração](#configuração)
- [Usabilidade](#usabilidade)
- [API Endpoints](#api-endpoints)
- [Autenticação](#autenticação)
- [Database](#database)

#### Instalação

1. Clone o repositório:

    - `git clone https://github.com/genari-j/adapt-control-api.git`

2. Instale as dependências com yarn

    - `yarn`

3. Crie um Banco de Dados em sua máquina

    - Recomendável (MySQL)
    - Esteja ciente que o serviço de db esteja rodando
    - O projeto está rodando com `Prisma` e caso queira alterar o serviço de Banco, é necessário alterar o provider para o arquivo `schema.prisma`

4. Configurando Variáveis de Ambiente

    - Note que há um arquivo .env-example na raiz
    - Apenas crie outro arquivo na raiz com o nome `.env` preenchendo as variáveis do .env-example

5. Rode as migrações e as Seeds apontando para o DB criado

    - Aplicando migrações -> `npx prisma migrate dev`
    - Poluindo o DB com seeds -> `npx prisma db seed`

#### Usabilidade

1. Inicie a aplicação com yarn -> `yarn dev`

2. A API ficará acessível em -> `http://localhost:3002/`
    - Caso tenha colocado outra porta, apenas altere `3002` para sua porta;

#### API Endpoints
A API fornece os seguintes Endpoints:

#### Users:

| Endpoint              | HTTP Method           | Description                    |
| --------------------- | --------------------- | ------------------------------ |
| /users                | GET                   | Get all users                  |
| /users/:id            | GET                   | Get user by id                 |
| /signin               | POST                  | Logging in                     |
| /signup               | POST                  | Create user                    |
| /users/:id            | PUT                   | Update user                    |
| /users/:id            | DELETE                | Disable user                   |
| /verify-token         | GET                   | Verify token to reset password |
| /password/recovery    | POST                  | Solicitation to reset password |
| /password/set-new     | PATCH                 | Confirm new password           |

#### Departments:

| Endpoint              | HTTP Method           | Description                    |
| --------------------- | --------------------- | ------------------------------ |
| /departments          | GET                   | Get all departments            |

#### Categories:

| Endpoint              | HTTP Method           | Description                    |
| --------------------- | --------------------- | ------------------------------ |
| /categories           | GET                   | Get all categories             |
| /categories           | POST                  | Create category                |

#### Payments:

| Endpoint              | HTTP Method           | Description                    |
| --------------------- | --------------------- | ------------------------------ |
| /payments             | GET                   | Get all payments               |

#### Products:

| Endpoint              | HTTP Method           | Description                    |
| --------------------- | --------------------- | ------------------------------ |
| /products             | GET                   | Get all products               |
| /products/:id         | GET                   | Get product by id              |
| /products             | POST                  | Create product                 |
| /products/:id         | PUT                   | Update product                 |
| /products/:id         | DELETE                | Disable product                |

#### Sales:

| Endpoint              | HTTP Method           | Description                    |
| --------------------- | --------------------- | ------------------------------ |
| /sales                | GET                   | Get all sales                  |
| /sales                | POST                  | Create sale                    |

#### Profiles:

| Endpoint              | HTTP Method           | Description                    |
| --------------------- | --------------------- | ------------------------------ |
| /profiles             | GET                   | Get all profiles               |

#### Autenticação
O sistema está lidando com permissões de usuários. Ao criar um usuário, é definido também o nível de permissão. Dependendo do nível de rotas sendo acessadas, apenas níveis de ADMIN/GESTOR estão autorizados.

  - `ADMIN` -> Consegue realizar todas operações do sistema;
  - `GESTOR` -> Consegue realizar parte das operações;
  - `FUNCIONÁRIO` -> Consegue realizar somente atividades de leitura;

#### Database
É recomendável utilizar o [MySQL](https://www.mysql.com/) como Banco de Dados. Abaixo está listado novamente os comandos para lidar com Migrações e Seeds.

  - Aplicando migrações -> `npx prisma migrate dev`
  - Poluindo o DB com seeds -> `npx prisma db seed`
  - O projeto está rodando com [Prisma](https://www.prisma.io/) e caso queira alterar o serviço de Banco, é necessário alterar também o provider no arquivo `schema.prisma`