# Secure Dashboard for the OpenJS Foundation

This is an evolution of [this proof of concept (POC)](https://github.com/UlisesGascon/poc-openjs-security-program-standards-dashboard).

## Prerequisites

- Node.js 22 and npm
- Docker and Docker Compose
- Github token with repo:read level access.

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

## Configuration

### Environment Variables

This project requires a GitHub token to access the GitHub API. You need to set the `GITHUB_TOKEN` environment variable. 

#### Optional: use .env file

Create a `.env` file and add your GitHub token:

```sh
GITHUB_TOKEN=your_github_token_here
```

then use `--env-file` flag to load it, like `node --env-file=.env index.js workflow run --name populate-repos-list`


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

### Examine the database schema

You can find an updated version of the schemas in [/src/database/schema/schema.sql](src/database/schema/schema.sql) so you don't have to start the infra and run the migrations if you just want to know about the database structure.

### Update the database schema

To update the schema, use the following command:

```bash
npm run db:generate-schema
```

## Usage

### Projects

To add a new project, use the following command:

```bash
node index.js project add [--name <name>] [--github-urls <urls...>] [--category <category>]
```

For example, to add a project named "express" with GitHub URLs:

```bash
node index.js project add --name express --github-urls https://github.com/expressjs https://github.com/pillarjs https://github.com/jshttp --category impact
```

### Workflows

To run a workflow, use the following command:

```bash
node index.js workflow run [--name <name>]
```

To list all available workflows, use the following command:

```bash
node index.js workflow list
```

### Checks

You can list all the implemented checks, use the following command:

```bash
node index.js check list
```

## Debug mode

This project uses the [debug library](https://www.npmjs.com/package/debug), so you can always use the environmental variable `DEBUG=*` to print more detailed information of the execution.


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