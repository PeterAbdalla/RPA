# RPA

## Installation

Requires [Node.js](https://nodejs.org/) and [Python](https://www.python.org/) to run.

Requires [PostgreSQL](https://www.postgresql.org/) for DB queries.

Follow the installation steps:

Clone the repo:

```bash
git clone https://github.com/PeterAbdalla/RPA.git
```

Install the dependencies:

```bash
npm i -g --production windows-build-tools (for windows OS)
npm i -g puppeteer
npm i
```

Set the environment variables:

```bash
cp .env.example .env
```
Open the Terminal and run these commands.

```sh
npm run dev
```

Access the API Swagger documentation:

```sh
http://localhost:{port}/v1/docs/
```
