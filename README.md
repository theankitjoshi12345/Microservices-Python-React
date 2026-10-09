# Microservices Python + React

This project uses Django, Flask, RabbitMQ, MySQL, and a React/Vite frontend to manage products and record likes.

See [ARCHITECTURE.md](ARCHITECTURE.md) for the current system design and local setup.

## Start the complete stack

After creating `admin/.env` and `main/.env` from their `.env.example` files, start the Admin API and worker, Main API and worker, both MySQL databases, and the React frontend with one command:

```bash
docker compose up --build
```

The applications are then available at:

- React: http://localhost:5173
- Admin API: http://localhost:8000
- Main API: http://localhost:8001

Use `docker compose down` to stop the stack. Database data is retained in the existing `admin/.dbdata` and `main/.dbdata` directories.

## Frontend

The React/Vite app is in `react-vite-frontend/`. It uses Tailwind CSS and provides:

- a Main storefront at `/`;
- Admin product listing, creation, editing, and deletion at `/admin/products`;
- local API calls to the Django Admin API on port 8000 and Flask Main API on port 8001.

Run it with:

```bash
cd react-vite-frontend
pnpm install
pnpm dev
```

## Next step

The next implementation step is [actual user authentication](https://github.com/theankitjoshi12345/Microservices-Python-React/issues/1). The current like flow intentionally uses a randomly selected user and must not be treated as authenticated behavior.
