#!/usr/bin/env bash
set -euo pipefail

start_port="${1:-8000}"
port="$start_port"

while lsof -nP -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1; do
  port=$((port + 1))
done

echo "$port"
