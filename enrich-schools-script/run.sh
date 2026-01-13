#!/bin/bash
# Wrapper script to load environment variables before running the enrichment script

# Load environment variables from .env in the same directory
set -a
source "$(dirname "$0")/.env" 2>/dev/null || {
    echo "Error: .env not found"
    exit 1
}
set +a

# Run the TypeScript script with tsx
npx tsx "$(dirname "$0")/index.ts" "$@"
