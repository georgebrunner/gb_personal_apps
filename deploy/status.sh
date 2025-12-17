#!/bin/bash
# status.sh - Check status of all services

echo "========================================="
echo "Service Status"
echo "========================================="
echo ""

echo "nginx:"
sudo systemctl is-active nginx || true
echo ""

for app in health guitar todo finance food sales; do
    echo "gb-$app-api:"
    sudo systemctl is-active gb-$app-api || true
done

echo ""
echo "========================================="
echo "Recent logs (last 5 lines each):"
echo "========================================="

for app in health guitar todo finance food sales; do
    echo ""
    echo "--- gb-$app-api ---"
    sudo journalctl -u gb-$app-api -n 5 --no-pager 2>/dev/null || echo "No logs yet"
done
