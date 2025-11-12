#!/usr/bin/env bash

set -euo pipefail

API_URL="${API_URL:-http://localhost:8080}"
EMAIL="${SMOKE_EMAIL:-smoke_$RANDOM@example.com}"
PASSWORD="${SMOKE_PASSWORD:-SmokePass123}"

info() { printf '\n[%s] %s\n' "$(date +%H:%M:%S)" "$*"; }

info "Register user $EMAIL"
curl -sS -w "\nHTTP %{{http_code}}\n" -X POST "$API_URL/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}"

info "Login"
TOKEN=$(curl -sS -X POST "$API_URL/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}" | jq -r '.token')

echo "Token: $TOKEN"

info "Create todo"
curl -sS -w "\nHTTP %{{http_code}}\n" -X POST "$API_URL/todos" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Smoke task"}'

info "List todos"
curl -sS -w "\nHTTP %{{http_code}}\n" -H "Authorization: Bearer $TOKEN" "$API_URL/todos"


