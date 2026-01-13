#!/bin/bash

# Fix npm install ENOTEMPTY errors
# Run this script from the project root directory

set -e

echo "🔧 Fixing npm install issues..."

# Navigate to project directory
cd "/Volumes/Chus Hard Drive/Chus/⛵️ TestNauti.co/code"

# Step 1: Remove file locks
echo "📦 Removing file locks from node_modules..."
find node_modules -type f -exec chflags nouchg {} \; 2>/dev/null || true
find node_modules -type d -exec chflags nouchg {} \; 2>/dev/null || true

# Step 2: Remove problematic temp directories
echo "🗑️  Removing problematic temp directories..."
rm -rf node_modules/.eslint-config-next-* 2>/dev/null || true
rm -rf node_modules/.next-* 2>/dev/null || true
rm -rf node_modules/eslint-config-next 2>/dev/null || true
rm -rf node_modules/next 2>/dev/null || true

# Step 3: If still having issues, try removing all temp directories
echo "🧹 Cleaning all npm temp directories..."
find node_modules -type d -name ".*" -exec rm -rf {} \; 2>/dev/null || true

# Step 4: Try npm install
echo "📥 Running npm install..."
npm install --legacy-peer-deps

echo "✅ Done!"

