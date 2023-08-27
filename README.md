<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Description

Template CMS Nestjs.

## Env templates

```bash
# Api
./apps/api/.env.template
```

## Installation

```bash
yarn install
```

## Running the app

```bash
# Development
yarn start:dev

# Production build
yarn build

# Start project in production
yarn start

# Start PostgreSQL and pgAdmin
docker-compose up -d

# Stop PostgresSQL and pgAdmin
docker-compose down -d
```

## Project structure

```Text
src/
|-- modules/
|   |-- users/
|   |   |-- dtos/
|   |   |-- entities/
|   |   |-- users.controller.ts
|   |   |-- users.module.ts
|   |   |-- users.service.ts
|-- core/
|   |-- exceptions/
|   |-- filters/
|   |-- guards/
|   |-- interceptors/
|   |-- helpers/
|   |-- validators/
|-- config/
|   |-- env.config
|   |-- joi.validation.ts
|-- main.ts
|-- app.module.ts
```

## Stay in touch

- Author - Diego Buezo
