#!/bin/bash
# start-all.sh - Start nginx and all backend services

echo "Starting all services..."

# Start nginx
sudo systemctl start nginx

# Start all backend APIs
sudo systemctl start gb-health-api gb-guitar-api gb-finance-api gb-todo-api gb-food-api gb-sales-api

echo "All services started!"
echo ""
echo "Check status with: ./deploy/status.sh"
