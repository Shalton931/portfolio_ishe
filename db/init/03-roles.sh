#!/bin/bash
# Creates a least-privilege, READ-ONLY database role for the API.
# The API never connects as the admin user, so a compromised API cannot modify or drop data.
set -euo pipefail

: "${APP_DB_PASSWORD:?APP_DB_PASSWORD must be set}"

psql -v ON_ERROR_STOP=1 -v app_pw="$APP_DB_PASSWORD" -v db="$POSTGRES_DB" \
     --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<'EOSQL'
CREATE ROLE portfolio_app LOGIN PASSWORD :'app_pw'
  NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT CONNECTION LIMIT 20;

REVOKE ALL ON DATABASE :"db" FROM PUBLIC;
GRANT CONNECT ON DATABASE :"db" TO portfolio_app;

REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT USAGE ON SCHEMA public TO portfolio_app;
GRANT SELECT ON profile, projects, skills, education, achievements TO portfolio_app;

ALTER ROLE portfolio_app SET statement_timeout = '5s';
ALTER ROLE portfolio_app SET default_transaction_read_only = on;
EOSQL
