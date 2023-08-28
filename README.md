<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Description

Template CMS Nestjs.

## Environments

```bash
# Environment template
.env.template
```

## Installation

Use the package manager [yarn](https://yarnpkg.com/) to install dependencies.

```bash
yarn install
```

## Running the app

```bash
# development
yarn run start

# watch mode
yarn run start:dev

# production mode
yarn run start:prod

# Production build
yarn build

# Start PostgreSQL and pgAdmin
docker-compose up -d

# Stop PostgresSQL and pgAdmin
docker-compose down -d
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Project structure

```Text
template-cms-nestjs/
|- .husky
|- src/
|  |- config/
|  |  |- env.config
|  |  └- joi.validation.ts
|  |- core/
|  |  |- exceptions/
|  |  |- filters/
|  |  |- guards/
|  |  |- interceptors/
|  |  |- helpers/
|  |  └─ validators/
|  |- modules/
|  |  └─ users/
|  |     |- dtos/
|  |     |- entities/
|  |     |- users.controller.spec.ts
|  |     |- users.controller.ts
|  |     |- users.module.ts
|  |     |- users.service.spec.ts
|  |     └─ users.service.ts
|  |─ app.module.ts
|  └─ main.ts
|- test/
|  |- modules
|  |  └- users.e2e-spec.ts
|  |─ app.e2e-spec.ts
|  └─ jest-e2e.json
|- .env
|- .env.template
|- .eslintrc.js
|- .gitignore
|- .lintstagedrc
|- .prettierrc
|- docker-compose.yml
|- nest-cli.json
|- package.json
|- README.md
|- tsconfig.build.json
|- tsconfig.json
└─ yarn.lock
```

## Stay in touch

- Author - Diego Buezo
