# Password Manager (passop)

A lightweight password manager frontend built with React + Vite. It provides a clean, responsive UI for managing credentials and integrates client-side encryption so secrets are protected before storage or transmission.

Live demo: https://password-manager-5k5d.vercel.app/

Highlights
- Built with React + Vite for fast development and build times.
- Tailwind CSS for utility-first styling.
- Client-side encryption using crypto-js.
- Small, dependency-light SPA suitable for local use or connecting to a backend API.

## Stack
- **Language(s):** JavaScript, HTML, CSS
- **Framework / runtime:** React (Vite)
- **Notable libraries:** crypto-js, tailwindcss, react-toastify, lucide-react, uuid

## Features
- Add, edit, and delete stored credentials (name, username, password, notes).
- Client-side encryption utilities for protecting stored secrets.
- Responsive UI with a simple navigation and manager interface.
- Toast notifications and accessible iconography (react-toastify, lucide-react).

## Project layout
Top-level important directory (inside `passop/`):
```
passop/
  public/         static assets (favicon, icons)
  src/
    components/   UI components (Navbar, Manager, Footer, ...)
    main.jsx      app bootstrap
    index.css      global styles
  package.json     scripts & dependencies
  vite.config.js   Vite config
  .env.example     example environment variables
```

How it fits together:
- The Vite-powered React app mounts from `src/main.jsx` and renders the main app (`App.jsx`), with the password management UI implemented in `src/components/Manager.jsx`.
- UI components use Tailwind classes and lucide-react icons; crypto-js provides encryption helpers.
- The app can call a backend API if configured (see Environment variables).

## Getting started (development)
Prerequisites:
- Node.js (v18+ recommended) and npm

Clone, install, and run locally:
```bash
git clone https://github.com/rohanmendon26-byte/Password-Manager.git
cd Password-Manager/passop
npm install
npm run dev
```
Open the URL shown by Vite (usually http://localhost:5173).

Available npm scripts (from `passop/package.json`):
- `npm run dev` — start Vite dev server
- `npm run build` — build production assets
- `npm run preview` — preview production build locally
- `npm run lint` — run ESLint

## Environment
The app reads a Vite environment variable for a backend API URL. Use the example file as a starting point:
```
passop/.env.example
VITE_API_URL=https://example-api-url/
```
Copy and create `.env` in `passop/` if you need to point the app at a backend:
```bash
cp passop/.env.example passop/.env
# then edit passop/.env to set VITE_API_URL
```
Note: If the app is intended to store passwords locally (e.g., localStorage), confirm whether the backend expects encrypted payloads — the project includes crypto-js so client-side encryption may be used before sending to an API.

## Building for production
From `passop/`:
```bash
npm run build
# optionally preview the build
npm run preview
```
Deploy the built `dist/` from the `passop` package as a static site to your preferred host (Netlify, Vercel, Render, GitHub Pages, etc.).

## Security notes
- This repository includes client-side encryption utilities (crypto-js). Client-side encryption does not remove the need for secure backend storage and secure transport (HTTPS).
- Do not commit secrets or real credentials to the repository. Use environment variables and a secure secret management flow for any API keys.
- Review any cryptography usage for correct configuration before trusting the app for sensitive data.

## Contributing
Contributions welcome:
- Fork the repo and open a PR with changes.
- Please run the linter and keep code style consistent.
- If adding features, include tests or a short usage note in the README.

Suggested improvements
- Add a minimal backend to persist encrypted entries (if not already present).
- Add unit/integration tests and a CI workflow.
- Add a privacy/security section documenting encryption algorithms and threat model.

## Troubleshooting
- If the app fails to reach an API, check `VITE_API_URL` in `passop/.env`.
- If styles look broken, run a fresh `npm install` and ensure Tailwind is built by Vite.

## License
Add a license file as appropriate (MIT is common). Example:
```
MIT License
```

## Acknowledgements
- Vite, React, Tailwind CSS, crypto-js, react-toastify, lucide-react
