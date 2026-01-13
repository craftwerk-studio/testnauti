#!/bin/bash
# Wrapper script to load environment variables before running the enrichment script

# Load environment variables from .env.local
set -a
source "$(dirname "$0")/../../.env.local" 2>/dev/null || {
    echo "Error: .env.local not found"
    exit 1
}
set +a

# Run the TypeScript script with tsx
npx tsx "$(dirname "$0")/index.ts" "$@"
