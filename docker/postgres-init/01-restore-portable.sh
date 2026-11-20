#!/bin/sh
set -eu

DUMP_FILE="/docker-entrypoint-initdb.d/culinaryblog-portable.dump"

if [ ! -f "$DUMP_FILE" ]; then
  echo "[portable-data] No database snapshot found; API seeding will create demo data."
  exit 0
fi

echo "[portable-data] Restoring the Culinary Blog snapshot into $POSTGRES_DB..."
pg_restore \
  --username "$POSTGRES_USER" \
  --dbname "$POSTGRES_DB" \
  --no-owner \
  --no-privileges \
  --exit-on-error \
  "$DUMP_FILE"
echo "[portable-data] Database snapshot restored."
