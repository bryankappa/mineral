#!/bin/bash
set -e

cd "$(dirname "$0")"

if ! command -v bun &> /dev/null; then
    curl -fsSL https://bun.sh/install | bash
    export PATH="$HOME/.bun/bin:$PATH"
fi

bun install
bun run build
bun run start -- -p ${PORT:-3000}
