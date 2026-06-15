#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
start_port="${PORT:-8000}"
port="$(bash "$root/scripts/find-free-port.sh" "$start_port")"
port_file="$root/.api-port"

printf '%s' "$port" > "$port_file"

if [ "$port" != "$start_port" ]; then
  echo "Port $start_port busy — using $port" >&2
else
  echo "API on http://127.0.0.1:$port" >&2
fi

cd "$root/backend"
exec uv run fastapi dev --port "$port"
