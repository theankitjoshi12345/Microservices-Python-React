# Microservices Python + React

This project uses Django, Flask, RabbitMQ, MySQL, and a React/Vite frontend to manage products and record likes.

See [ARCHITECTURE.md](ARCHITECTURE.md) for the current system design and local setup.

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
