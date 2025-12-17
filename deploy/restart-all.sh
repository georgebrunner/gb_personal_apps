#!/bin/bash
# restart-all.sh - Restart all backend services

echo "Restarting all services..."

sudo systemctl restart gb-health-api gb-guitar-api gb-finance-api gb-todo-api gb-food-api gb-sales-api
sudo systemctl restart nginx

echo "All services restarted!"
