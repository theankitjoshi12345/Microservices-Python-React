# Architecture

## Current starting point

The repository contains three independently runnable applications and two MySQL databases. No asynchronous integration is configured; the project is a simple baseline for future work.

```text
React client
    |
    +--> Admin API (Django REST Framework) ----> admin MySQL
    |
    +--> Main API (Flask) --------------------> main MySQL
                         |
                         +--> Admin API /api/user (HTTP, for likes)
```

## Components

| Component | Directory | Responsibility | Port |
| --- | --- | --- | --- |
| Admin API | `admin/` | Django REST API for products and users | 8000 |
| Main API | `main/` | Flask API for the product read model and likes | 8001 |
| Client | `react-crud/` | React browser application | 3000 |
| Admin database | `admin/.dbdata/` | MySQL data owned by the Admin API | 3306 |
| Main database | `main/.dbdata/` | MySQL data owned by the Main API | 3307 |

Each backend has its own Docker Compose file, Dockerfile, and `.env.example` file. Only database and application configuration remain.

## Local configuration

Copy the environment templates and supply local values:

```bash
cp admin/.env.example admin/.env
cp main/.env.example main/.env
```

Required values:

- `admin/.env`: `DJANGO_SECRET_KEY` and `MYSQL_ROOT_PASSWORD`
- `main/.env`: `MYSQL_ROOT_PASSWORD`

The password used in an existing MySQL data directory must match the password that initialized it. To use a new password, start with a new database volume.

## Intentional limitations

The Admin and Main services currently do not synchronize product data. Any future synchronization or asynchronous processing should be designed explicitly and added back only with its configuration, operational behavior, and failure handling documented.
