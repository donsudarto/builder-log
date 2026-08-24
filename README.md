# Base Learning Project

Mini open-source project untuk mempelajari:

- Git dan GitHub
- Ethereum Layer 2
- Base network
- Wallet dan transaction flow
- JavaScript testing
- Dokumentasi development

## Project structure

```text
docs/    development notes
src/     source code
tests/   tests


cat > ~/run.sh <<'EOF'
#!/data/data/com.termux/files/usr/bin/bash
set -e

USER="donsudarto"
REPO="builder-log"
REMOTE="git@github.com:$USER/$REPO.git"

echo "=== Base Learning Project ==="

cd "$HOME"

if [ ! -d "$REPO/.git" ]; then
    git clone "$REMOTE" "$REPO"
fi

cd "$REPO"
git remote set-url origin "$REMOTE"
git pull --rebase origin main || true

mkdir -p docs src tests

cat > README.md <<'TXT'
# Base Learning Project

A small open-source project for learning Base, Ethereum L2,
Git workflows, transaction concepts, and testing.

## Roadmap

- Base network concepts
- Wallet interaction
- Transaction handling
- Smart contract development
- Testing
- Testnet experiments
