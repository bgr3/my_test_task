## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

# Installation

- install Node 22;
- install pnpm - 10.11.0 and higher;
- run `pnpm install` - install dependencies;

# Run:

- create `.local.env` file using `.env_example`

## Migration:

- `pnpm migration:generate {MIGRATION_NAME}` - generate SQL from entities in migration file named "MIGRATION_NAME"
- `pnpm migration:run` - execute up() all pending migrations
- `pnpm migration:revert` - execute down() in the latest executed migration

## Compile and run the project

```bash
# development
$ pnpm start

# watch mode
$ pnpm start:dev

# production mode
$ pnpm start:prod
```

## Run tests

```bash
# unit tests
$ pnpm test

# e2e tests
$ pnpm test:e2e

# test coverage
$ pnpm test:cov
```

## Stay in touch

- Author - [Алексей Борисенко](https://web.telegram.org/k/#@AlexeyBorisenko)
- gmail - [borisenkoalexey3@gmail.com](borisenkoalexey3@gmail.com)
- LinkedIn - [Алексей Борисенко](https://www.linkedin.com/in/%D0%B0%D0%BB%D0%B5%D0%BA%D1%81%D0%B5%D0%B9-%D0%B1%D0%BE%D1%80%D0%B8%D1%81%D0%B5%D0%BD%D0%BA%D0%BE-19a908303/)
