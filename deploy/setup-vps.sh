#!/usr/bin/env bash
# One-time provisioning script for the Ollama VPS (Hetzner CX22 / DO
# Basic Droplet — 2 vCPU / 4GB RAM is enough for gemma4:e4b + translategemma
# at the traffic this app expects; see AGENT_COSTS.md for what actually
# runs on this box and why). Run as root on a fresh Ubuntu 22.04/24.04
# droplet, once.
#
# Before running, point a DNS A record at this VPS's IP (e.g.
# ollama.yourdomain.com), then:
#
#   export OLLAMA_PUBLIC_DOMAIN="ollama.yourdomain.com"
#   export OLLAMA_AUTH_TOKEN="$(openssl rand -hex 32)"   # save this — it
#                                                          # also goes into
#                                                          # Vercel's env vars
#   curl -fsSL https://raw.githubusercontent.com/<you>/<repo>/main/deploy/setup-vps.sh | bash
#
# or copy this repo's deploy/ folder onto the box and run it locally —
# either works, nothing here depends on being fetched remotely.

set -euo pipefail

if [ "$(id -u)" -ne 0 ]; then
  echo "Run this as root (or with sudo)." >&2
  exit 1
fi

: "${OLLAMA_PUBLIC_DOMAIN:?Set OLLAMA_PUBLIC_DOMAIN first — the domain pointed at this VPS.}"
: "${OLLAMA_AUTH_TOKEN:?Set OLLAMA_AUTH_TOKEN first — generate one with: openssl rand -hex 32}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "==> Updating system packages"
apt-get update -y
apt-get upgrade -y

echo "==> Installing Ollama"
curl -fsSL https://ollama.com/install.sh | sh

echo "==> Pinning Ollama to localhost-only (defense in depth — Caddy is the only public door)"
install -m 644 "$SCRIPT_DIR/ollama.env" /etc/ollama.env
mkdir -p /etc/systemd/system/ollama.service.d
cat > /etc/systemd/system/ollama.service.d/override.conf <<'EOF'
[Service]
EnvironmentFile=/etc/ollama.env
EOF
systemctl daemon-reload
systemctl enable --now ollama

echo "==> Waiting for Ollama to come up"
for i in $(seq 1 30); do
  if curl -fsS http://127.0.0.1:11434 >/dev/null 2>&1; then break; fi
  sleep 1
done

echo "==> Pulling models (see AGENT_COSTS.md for what each is used for)"
ollama pull gemma4:e4b
ollama pull translategemma

echo "==> Installing Caddy"
apt-get install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list
apt-get update -y
apt-get install -y caddy

echo "==> Writing Caddy config"
install -m 644 "$SCRIPT_DIR/Caddyfile" /etc/caddy/Caddyfile
cat > /etc/caddy/caddy.env <<EOF
OLLAMA_PUBLIC_DOMAIN=${OLLAMA_PUBLIC_DOMAIN}
OLLAMA_AUTH_TOKEN=${OLLAMA_AUTH_TOKEN}
EOF
chmod 600 /etc/caddy/caddy.env
mkdir -p /etc/systemd/system/caddy.service.d
cat > /etc/systemd/system/caddy.service.d/override.conf <<'EOF'
[Service]
EnvironmentFile=/etc/caddy/caddy.env
EOF
systemctl daemon-reload
systemctl enable --now caddy
systemctl reload caddy

echo "==> Configuring firewall (only SSH, HTTP, HTTPS reach this box from outside)"
apt-get install -y ufw
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

echo ""
echo "=================================================================="
echo "Done. Ollama is running behind Caddy at:"
echo "  https://${OLLAMA_PUBLIC_DOMAIN}"
echo ""
echo "Verify the token gate works (this should succeed):"
echo "  curl -H \"Authorization: Bearer ${OLLAMA_AUTH_TOKEN}\" https://${OLLAMA_PUBLIC_DOMAIN}/v1/models"
echo ""
echo "And this should fail with 401 (no token):"
echo "  curl https://${OLLAMA_PUBLIC_DOMAIN}/v1/models"
echo ""
echo "Now set these in Vercel's project env vars (see DEPLOY.md):"
echo "  OLLAMA_BASE_URL=https://${OLLAMA_PUBLIC_DOMAIN}"
echo "  OLLAMA_AUTH_TOKEN=${OLLAMA_AUTH_TOKEN}"
echo "=================================================================="
