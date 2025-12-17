#!/bin/bash
# stop-all.sh - Stop all backend services

echo "Stopping all services..."

sudo systemctl stop gb-health-api gb-guitar-api gb-finance-api gb-todo-api gb-food-api gb-sales-api
sudo systemctl stop nginx

echo "All services stopped."
