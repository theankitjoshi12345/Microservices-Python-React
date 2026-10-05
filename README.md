# Microservices Python + React

A small product application built as three independently run services:

| Directory | Technology | Purpose |
| --- | --- | --- |
| `admin/` | Django REST Framework | Owns products and users, and publishes product events. |
| `main/` | Flask | Maintains a product read model and handles product likes. |
| `react-crud/` | React + TypeScript | Browser client. |

The Python services exchange events through RabbitMQ. Each backend has its own MySQL database and Docker Compose configuration.

## Prerequisites

- Docker Desktop (including Docker Compose)
- Node.js and npm, for the React client
- A RabbitMQ-compatible connection URL

## Configure local environment

Create local environment files from the supplied templates. These files are ignored by Git.

```bash
cp admin/.env.example admin/.env
cp main/.env.example main/.env
```

Set the following values in each file:

- `MYSQL_ROOT_PASSWORD`: password for that service's local MySQL container.
- `RABBITMQ_URL`: full RabbitMQ connection URL. Include `?heartbeat=600` if supported by your broker.
- `DJANGO_SECRET_KEY`: required in `admin/.env`; generate a unique secret for local development.

## Run the backends

In separate terminals, start each stack:

```bash
cd admin
docker compose up --build
```

```bash
cd main
docker compose up --build
```

The Django API is available at `http://localhost:8000`, and the Flask service at `http://localhost:8001`. MySQL is exposed on ports `3306` and `3307` respectively.

## Run the React client

```bash
cd react-crud
npm install
npm start
```

The development server opens at `http://localhost:3000`.

## API overview

The Django service exposes product CRUD operations and a random-user endpoint:

- `GET` / `POST` `http://localhost:8000/api/products/`
- `GET` / `PUT` / `DELETE` `http://localhost:8000/api/products/<id>`
- `GET` `http://localhost:8000/api/user/`

The Flask service exposes its product read model and like endpoint:

- `GET` `http://localhost:8001/api/products`
- `POST` `http://localhost:8001/api/products/<id>/like`

## Security

Never commit `.env` files, database volumes, or broker credentials. If credentials have been shared publicly, rotate them with the provider before continuing to use them.
