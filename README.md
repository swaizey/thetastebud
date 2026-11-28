# thetastebud

The Taste Bud by Joy web application.

## Development

```sh
npm install
npm run dev
```

For local API testing, run the Worker from `../server` with `npm run dev`.
Vite proxies `/api` requests to `http://127.0.0.1:8787`. Production builds use
`https://api.thetastebudbyjoy.ng`; set `VITE_API_BASE_URL` to another API origin
when testing a different deployment such as the Worker `workers.dev` URL.
Google sign-in also requires the backend `API_ORIGIN` and registered OAuth
callback URL to match the selected API host.

## Validation and production build

```sh
npm run lint
npm run build
npm run preview
```

The production-ready static site is generated in `dist/`.

## Deployment

Build the app with `npm run build` and publish the generated `dist/` directory.
Configure the hosting provider to serve `index.html` for unknown paths so
direct links to React routes work.

This frontend currently has no backend authentication or authorization for its
admin routes. Do not expose the admin UI or real customer data publicly until
server-side access controls are implemented.
