# Ishe Shalton Milubi - Portfolio

A responsive portfolio site that loads its projects **live from PostgreSQL** through a small read-only API.

```
Browser  ->  Express API + static site (Node)  ->  PostgreSQL (read-only role)
```

| Folder | What it is |
| --- | --- |
| `web/` | Client side: `index.html`, `style.css`, `app.js`, `privacy.html` |
| `api/` | Express API (`/api/*`) that also serves `web/` |
| `db/init/` | Schema, CV seed data, read-only DB role (runs on first start) |

## Run it locally

Requires Docker.

```bash
cp .env.example .env
# edit .env and set POSTGRES_PASSWORD and APP_DB_PASSWORD (openssl rand -base64 24)
docker compose up --build
```

Open http://localhost:3000.

## API (all GET, read-only)

`/api/profile` · `/api/projects` · `/api/projects/:slug` · `/api/skills` · `/api/education` · `/api/achievements` · `/api/health`

## Add or change a project (no redeploy needed)

```bash
docker compose exec db psql -U portfolio_admin -d portfolio -c \
  "INSERT INTO projects (slug,title,subtitle,description,role,technologies,repo_url,sort_order)
   VALUES ('my-new-project','My New Project','One-line subtitle','What it does.','My role.',
           ARRAY['React','Node.js'],'https://github.com/you/repo',4);"
```

Refresh the page (the API caches for up to 60 seconds). Set `repo_url` / `live_url` on the existing projects the same way with `UPDATE`.

Note: the seed files only run on a fresh database volume. To reseed from scratch: `docker compose down -v`.

## Security built in

- **Database:** the API connects as `portfolio_app`, a **read-only** role (SELECT on five tables, read-only transactions, 5 s statement timeout). The DB has no published port.
- **SQL injection:** static queries only; the single user input (`slug`) is regex-validated and parameterised.
- **XSS:** the front end writes API data with `textContent` (never `innerHTML`), only allows http(s) links, and a strict **CSP** blocks inline and third-party scripts.
- **Headers:** CSP, `nosniff`, `no-referrer`, frame blocking, Permissions-Policy, HSTS (when `FORCE_HTTPS=true`), `X-Powered-By` removed.
- **Abuse:** rate limit of 200 requests / 15 min per client on `/api`; non-GET methods get `405`; request timeouts.
- **Errors:** generic messages only; no stack traces or SQL details.
- **Container:** non-root user, read-only filesystem, all capabilities dropped, `no-new-privileges`.
- **Secrets:** only in `.env` (git-ignored); none in code.

## Going live (production checklist)

1. Host behind an HTTPS reverse proxy (e.g. Caddy or nginx with Let's Encrypt). Set `FORCE_HTTPS=true` and `TRUST_PROXY=1` in `.env`.
2. Use strong, unique passwords; keep `.env` out of git.
3. Back up the `pgdata` volume (`pg_dump` on a schedule).
4. Run `npm audit` and rebuild images regularly to pick up security updates.

## POPIA

The site collects **no personal information from visitors** (no forms, cookies, analytics or third-party scripts), and the app log stores no IP addresses. `web/privacy.html` is the privacy notice.

Before launch, please:

- Fill in your **hosting provider's name and country** in section 2 of `privacy.html` (hosts keep their own network logs, and cross-border hosting should be disclosed).
- Decide whether you are comfortable publishing your email address. Your **phone number was left out** on purpose (spam and scam risk).
- If you later add a contact form or analytics, update the privacy notice first and add consent where required.

This is a good-practice starting point, not legal advice.
