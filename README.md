# Secure Dashboard for the OpenJS Foundation

This is an evolution of [this proof of concept (POC)](https://github.com/UlisesGascon/poc-openjs-security-program-standards-dashboard).

## Prerequisites

- Node.js 22 and npm
- Docker and Docker Compose

## Infrastructure

This project requires a PostgreSQL database. You can run this project using a local database with Docker. Additionally, this project provides an instance of [Adminer](https://www.adminer.org/) accessible at `http://localhost:8080`.


### Starting the Infrastructure

To start the infrastructure, run the following command:

```bash
npm run infra:start
```

### Stopping the Infrastructure

To stop the infrastructure, run the following command:

```bash
npm run infra:stop
```

## Database Management

### Running Migrations

To run the latest database migrations, use the following command:

```bash
npm run db:migrate
```

### Rolling Back Migrations

To rollback the last batch of migrations, use the following command:

```bash
npm run db:rollback
```

### Seeding the Database

To seed the database with initial data, use the following command:

```bash
npm run db:seed
```

## Linting

To lint the files, use the following command:

```bash
npm run lint
```

To automatically fix linting issues, use the following command:

```bash
npm run lint:fix
```

## Running Tests

To run the tests, use the following command:

```bash
npm test
```

To run the tests with coverage, use the following command:

```bash
npm run test:coverage
```

## License

This project is licensed under the MIT License. See the [LICENSE](/LICENSE) file for details.