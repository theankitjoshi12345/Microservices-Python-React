# Product Workspace Frontend

React, Vite, TypeScript, Tailwind CSS, and React Router power the local product storefront and Admin product-management UI.

## Run locally

```bash
pnpm install
pnpm dev
```

The app calls the local Admin API at `http://localhost:8000` and Main API at `http://localhost:8001`.

## Routes

- `/`: storefront and like action
- `/admin/products`: product administration
- `/admin/products/create`: create a product
- `/admin/products/:id/edit`: edit a product

## Next step

Implement [actual user authentication](https://github.com/theankitjoshi12345/Microservices-Python-React/issues/1). The current like operation uses a random backend-selected user and is only temporary development behavior.
