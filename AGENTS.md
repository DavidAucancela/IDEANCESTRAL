# AGENTS.md

## Project

Ideancestral — full-stack e-commerce for an artisan craft store (Quito, Ecuador). Vue 3 + Node/Express + PostgreSQL. All docs, comments, and filenames are in **Spanish**.

## Repo layout

Monorepo at the repo root, with a root `package.json` orchestrator using `concurrently`.

```
./
├── frontend/    # Vue 3 SPA (Vite 5, Pinia, Vue Router, vue-i18n)
├── backend/     # Express 4 API (ESM modules, raw SQL, no ORM)
├── docs/        # Setup, deploy, security guides (Spanish)
└── package.json # Root scripts (dev, install:all, build)
```

## Key commands

```bash
npm run install:all          # Install deps in root + frontend + backend
npm run dev                  # Frontend (:5173) + backend (:3000) via concurrently
npm run dev:backend          # Backend only (node --watch)
npm run dev:frontend         # Frontend only (vite)
npm run build                # Frontend production build (Vite)
npm run build:prod           # Same but sets VITE_API_URL=/api
npm run db:start             # PostgreSQL only via docker-compose

# Database init (must cd into backend first)
cd backend && node scripts/init-db.js --seed  # Idempotent, creates tables + sample data
cd backend && node scripts/create-admin.js    # Create admin user
```

## Testing

Vitest is installed in both packages but **no `test` script is defined** in either `package.json`. Run directly:

```bash
cd backend && npx vitest run
cd frontend && npx vitest run
```

Only 2 test files exist: `backend/utils/sanitize.test.js` and `frontend/src/stores/carrito.test.js`. There is no lint, no typecheck, and no formatter configured.

## Module system

Both packages use `"type": "module"` (ESM). Backend entry: `backend/server.js`. Frontend entry: `frontend/src/main.js`. Pure JavaScript — no TypeScript.

## Architecture notes

- **No ORM** — backend uses raw SQL via `pg` pool (`backend/database/connection.js`)
- **Two image systems**: `/imagenes/` (static, in repo under `frontend/public/`) and `/uploads/` (admin-uploaded, gitignored, DB-verified)
- **Production deploy** is a single Docker container (`backend/Dockerfile`) that builds frontend with Vite then serves both from Express
- **Database**: PostgreSQL 16, 7 tables. Schema at `backend/database/schema.sql`, migrations in `backend/database/migrations/`
- **Frontend proxy**: Vite dev server proxies `/api` → `localhost:3000`
- **Auth**: JWT access tokens (1h) + refresh tokens (7d, hashed). `JWT_SECRET` validated at startup (min 32 chars, exits hard if weak)
- **i18n**: 3 languages — Spanish (default), English, Portuguese. Translations in `frontend/src/i18n/`

## Conventions

- Spanish filenames: routes (`productos.js`, `categorias.js`), views (`CatalogoView.vue`), stores (`carrito.js`)
- Vue 3 Composition API. `Base*` components use `<script setup>`; views and older components use `export default { setup() }`; `App.vue` uses Options API
- i18n is a custom Pinia store (`stores/language.js`), not vue-i18n
- Backend: Express router per resource, middleware for auth/audit/https, Zod for validation, Pino for logging
- No `.editorconfig`, `.eslintrc`, or `.prettierrc` — no enforced code style

## Deployment

- **Railway** (primary): auto-deploys on push to main, configured in `railway.toml`
- `backend/docker-entrypoint.sh` runs DB migrations on production startup
- CORS restricted to `FRONTEND_URL` + localhost dev ports
