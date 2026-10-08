# Architecture

## Overview

The project has three applications and two independently owned MySQL databases. The Admin service is the source of truth for products and users. The Main service maintains a local product read model and records product likes. Product changes flow one way from Admin to Main through RabbitMQ.

```text
                         product-created / updated / deleted events
┌─────────────────┐                  │                  ┌─────────────────┐
│ Admin API       │                  ▼                  │ Main worker     │
│ Django REST     │ ─────────► RabbitMQ queue: main ───► │ Flask + Pika    │
│ localhost:8000  │                                     └────────┬────────┘
└────────┬────────┘                                              │
         │                                                       ▼
         ▼                                                ┌───────────────┐
┌─────────────────┐                                      │ Main MySQL    │
│ Admin MySQL     │                                      │ localhost:3307│
│ localhost:3306  │                                      └───────┬───────┘
└─────────────────┘                                              │
         ▲                                                       ▼
         │                                                ┌─────────────────┐
         └──── user lookup for a like ───────────────────│ Main API        │
                                                          │ Flask :8001     │
                                                          └────────┬────────┘
                                                                   │
                                                                   ▼
                                                            React client
```

## Components

| Component | Directory / service | Responsibility | Host port |
| --- | --- | --- | --- |
| Admin API | `admin/` / `backend` | Django REST API; owns products and users | 8000 |
| Admin worker | `admin/` / `queue` | Consumes the `admin` queue | — |
| Admin database | `admin/` / `db` | MySQL source-of-truth database | 3306 |
| Main API | `main/` / `main` | Flask read API and like endpoint | 8001 |
| Main worker | `main/` / `queue` | Consumes product events from the `main` queue | — |
| Main database | `main/` / `db` | MySQL read-model and product-like database | 3307 |
| Client | `react-crud/` | React browser application | 3000 |

## Data ownership

| Data | Owner | Replica / usage |
| --- | --- | --- |
| Products | Admin `product_product` table | Replicated into Main `product` table for reads |
| Users | Admin `product_user` table | Main stores only a user ID when recording a like |
| Likes | Main `product_user` table | Not currently written back to Admin |

The databases are intentionally not a shared schema. Main must not write directly to Admin's database, and Admin must not write directly to Main's database.

## Product synchronization flow

1. A client creates, updates, or deletes a product through the Admin API.
2. Django commits the product change to Admin MySQL.
3. `admin/product/producer.py` opens a RabbitMQ connection and publishes JSON to the `main` queue.
4. The message `type` is one of `product_created`, `product_updated`, or `product_deleted`.
5. `main/consumer.py` receives the message, enters a Flask application context, and applies the change to Main MySQL.
6. The Main worker acknowledges the RabbitMQ message only after the database transaction commits successfully.

The Main worker uses manual acknowledgements (`auto_ack=False`). If its database operation fails, the message is not acknowledged, so it is not silently discarded.

## Consistency model and recovery

The system is eventually consistent: the Admin product change can succeed before Main receives and applies its event. A temporary difference between the two product tables is therefore expected while the message is in flight.

Current operational boundaries:

- Messages acknowledged before the manual-acknowledgement change cannot be replayed automatically; the corresponding products need a one-time backfill or replay.
- The consumer currently expects create events before update/delete events. An update for an absent Main product raises an error rather than inventing a product.
- A database commit followed by a worker failure before acknowledgement can cause a message to be delivered again. Future work should make create handling idempotent.
- The current like flow asks Admin for a random user through `/api/user`; it is demonstration behavior, not authentication.
- Likes are stored only in Main and do not update Admin's product `likes` field.

## Runtime configuration

Create local environment files from the templates:

```bash
cp admin/.env.example admin/.env
cp main/.env.example main/.env
```

Required values:

| File | Variables |
| --- | --- |
| `admin/.env` | `DJANGO_SECRET_KEY`, `MYSQL_ROOT_PASSWORD` |
| `main/.env` | `MYSQL_ROOT_PASSWORD` |

Compose maps `MYSQL_ROOT_PASSWORD` to `DB_PASSWORD` inside the Django and Flask containers. That is the value used by their database connection settings.

The current Pika clients contain the RabbitMQ connection URL in source code. This must be moved to an ignored environment variable before sharing the repository or deploying it; credentials do not belong in source control.

## Database migrations

- Admin uses Django migration `product.0001_initial`.
- Main uses Flask-Migrate/Alembic revision `672fac17f2c3`.

Migrations are only required after model/schema changes. They do not synchronize product rows between the two databases.

## Local operations

Start the stacks independently:

```bash
cd admin && docker compose up --build
cd main && docker compose up --build
```

The queue workers run as separate Compose services. Because the Main queue service copies source files into its image rather than mounting the project directory, rebuild and recreate it after changing `main/consumer.py`:

```bash
cd main
docker compose up -d --build --force-recreate queue
```
