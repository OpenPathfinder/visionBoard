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

## License

This project is licensed under the MIT License. See the [LICENSE](/LICENSE) file for details.