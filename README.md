![VisionBoard logo with a gold compass emblem and the tagline 'Transforming Data into Actionable Insights' on a black background](.github/OTHER/header.png)

# VisionBoard

Transforming Data into Actionable insights

---

This project aims to provide a secure and user-friendly dashboard for managing and monitoring projects under the OpenJS Foundation. It evolves from [this proof of concept (POC)](https://github.com/UlisesGascon/poc-openjs-security-program-standards-dashboard) and currently we are developing an MVP version ([milestone roadmap](https://github.com/OpenPathfinder/visionBoard/issues/30)).

## Table of Contents

1. [Motivation](#motivation)
    - [More context](#more-context)
    - [Engage now](#engage-now)
2. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Infrastructure Setup](#infrastructure-setup)
   - [Configuration](#configuration)
3. [Usage](#usage)
   - [Projects](#projects)
   - [Workflows](#workflows)
   - [Checks](#checks)
4. [Database Management](#database-management)
   - [Migrations](#migrations)
   - [Seeding](#seeding)
   - [Schema Management](#schema-management)
5. [Development](#development)
   - [Debugging](#debugging)
   - [Linting](#linting)
   - [Testing](#testing)
6. [Community Guidelines](#community-guidelines)
7. [License](#license)

---

## Motivation

The goal of this project is to streamline the secure management of OpenJS Foundation projects by providing an intuitive dashboard with robust infrastructure support. It emphasizes security, simplicity, and extensibility ✨

### More Context

A few months ago, we started a discussion about [the OpenJS Security Collab space initiative](https://github.com/openjs-foundation/security-collab-space) ("[Security Program Standards](https://github.com/openjs-foundation/security-collab-space/issues/211)") to build a dashboard for monitoring security parameters in our projects (Node.js, Electron, jQuery, Express, etc.). After carefully planning and securing resources, we are now at an exciting point as we’ve recently launched a pilot program with some projects. 🚀

So far, we’ve developed this website: [https://openjs-security-program-standards.netlify.app/](https://openjs-security-program-standards.netlify.app/), which is based on the checklist ([Google Sheet](https://docs.google.com/spreadsheets/d/1GwIsAudAn89xv9DAbr1HUaY4KEVBsYfg--_1cW0uIB0/edit#gid=0)) and the introductory document ([Google Doc](https://docs.google.com/document/d/1tvJYtptFXqvS4863dhPwoVmFT5Jwr_WZLralrnulCZs/edit)) that we compiled during our original research. 😄

You can watch this [YouTube video](https://www.youtube.com/watch?v=B1kd8k5SvBI) for a proper introduction to the Dashboard and website (both Proof of Concept versions) built based on feedback from [the Express Security WG](https://github.com/expressjs/security-wg) and others.

In essence, this tool collects information from multiple sources, evaluates it, transforms it into actionable insights, and uses it to build dashboards, tasks, and alerts at both the foundation and project levels. If you prefer a non-video format, here are [the slides](https://slides.ulisesgascon.com/openjs-security-program-standards/) and [the code repository](https://github.com/UlisesGascon/poc-openjs-security-program-standards-dashboard/blob/main/README.md).

Currently, we are focused on building a solid MVP and onboarding new contributors, aiming to create a great product by the end of this process. 😎

### Engage Now

Yes, we are looking for HELP in many ways! 😇 Let’s collaborate and have fun together. You can find more information in [the contributing guide](CONTRIBUTING.md). 🌟

Another great way to get involved is by participating in [the OpenJS Security Collab Space](https://github.com/openjs-foundation/security-collab-space). We hold regular meetings to discuss this initiative and many other exciting topics.

The project includes a [technical architecture guide](/ARCHITECTURE.md) that provides in-depth explanations of various concepts.

---

## Getting Started

### Prerequisites

- Node.js 22 and npm
- Docker and Docker Compose
- GitHub token with `repo:read` access level (not needed for development)

### Infrastructure Setup

This project requires a PostgreSQL database and includes an instance of [Adminer](https://www.adminer.org/) accessible at `http://localhost:8080`.

#### Start Infrastructure

```bash
npm run infra:start
```

#### Stop Infrastructure

```bash
npm run infra:stop
```

### Configuration


#### Environment Variables

Set the `GITHUB_TOKEN` environment variable to authenticate with the GitHub API.

Optionally, use a `.env` file:
```
GITHUB_TOKEN=your_github_token_here
```

Then load it using:

```bash
node --env-file=.env index.js workflow run --name populate-repos-list
```

## Usage

### Projects

Add a new project:

```bash
node index.js project add [--name <name>] [--github-urls <urls...>] [--category <category>]
```

Example:

```bash
node index.js project add --name express --github-urls https://github.com/expressjs https://github.com/pillarjs https://github.com/jshttp --category impact
```

### Workflows

Run a workflow:

```bash
node index.js workflow run [--name <name>]
```

List workflows:

```bash
node index.js workflow list
```

### Checks

List all checks:

```bash
node index.js check list
```
Run a specific check:

```bash
node index.js check run [--name <name>]
```

There is an specific workflow that runs all the checks sequentially:

```bash
node index.js workflow run run-all-checks
```

## Database Management

### Migrations

Run latest migrations:

```bash
npm run db:migrate
```

Rollback migrations:

```bash
npm run db:rollback
```

### Seeding

Seed the database:

```bash
npm run db:seed
```

### Schema Management

Check the schema:

Refer to the latest schema file at [/src/database/schema/schema.sql](src/database/schema/schema.sql).

Update the schema:

```bash
npm run db:generate-schema
```

## Development

### Debugging

Enable debug logs using the `DEBUG` environment variable:

```bash
DEBUG=* node index.js
```

### Linting

Run lint checks:

```bash
npm run lint
```

Fix lint issues:

```bash
npm run lint:fix
```

### Testing

Run tests:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

Update the snapshots when needed:
```bash
npm run test -- -u
```

## Community Guidelines

We encourage contributors to adhere to our [Code of Conduct](CODE_OF_CONDUCT.md) and [Contributing Guidelines](CONTRIBUTING.md). Security-related concerns should follow our [Security Policy](SECURITY.md).


## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.