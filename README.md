# thetastebud

The Taste Bud by Joy web application.

## Development

```sh
npm install
npm run dev
```

## Validation and production build

```sh
npm run lint
npm run build
npm run preview
```

The production-ready static site is generated in `dist/`.

## Deploy on Netlify

The repository root is the Vite app root. In Netlify, connect the `main` branch
and use:

- Build command: `npm run build`
- Publish directory: `dist`

These settings and the SPA route fallback are also defined in `netlify.toml`.
Direct links to React routes will load through the fallback.

This frontend currently has no backend authentication or authorization for its
admin routes. Do not expose the admin UI or real customer data publicly until
server-side access controls are implemented.
