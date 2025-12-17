#!/bin/bash
# build-frontends.sh - Build all frontend apps
# Run this on the server after uploading code

set -e  # Exit on error

cd ~/gb-apps

echo "Building all frontends..."

for app in health guitar todo finance food sales; do
    echo "Building gb-$app frontend..."
    cd gb-$app/frontend
    npm install --silent
    npm run build --silent
    cd ../..
    echo "  Done: gb-$app"
done

echo ""
echo "All frontends built successfully!"
