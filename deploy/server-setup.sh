#!/bin/bash
# server-setup.sh - Run this ONCE on a fresh EC2 instance
# Usage: ./server-setup.sh

set -e  # Exit on error

echo "========================================="
echo "GB Personal Apps - Server Setup"
echo "========================================="

# Update system
echo "Updating system packages..."
sudo dnf update -y

# Install Node.js 18
echo "Installing Node.js 18..."
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo dnf install -y nodejs

# Install Python 3.11
echo "Installing Python 3.11..."
sudo dnf install -y python3.11 python3.11-pip

# Install nginx and git
echo "Installing nginx and git..."
sudo dnf install -y nginx git

# Install Python packages globally
echo "Installing Python packages..."
sudo pip3.11 install fastapi uvicorn pydantic python-dateutil

# Create app directory
echo "Creating app directory..."
mkdir -p ~/gb-apps

# Copy nginx config
echo "Configuring nginx..."
sudo cp ~/gb-apps/deploy/nginx.conf /etc/nginx/nginx.conf

# Fix permissions for nginx to access home directory
sudo chmod 755 /home/ec2-user

# Install systemd services
echo "Installing systemd services..."
sudo cp ~/gb-apps/deploy/services/*.service /etc/systemd/system/
sudo systemctl daemon-reload

# Enable services to start on boot
sudo systemctl enable nginx
sudo systemctl enable gb-health-api gb-guitar-api gb-finance-api gb-todo-api gb-food-api gb-sales-api

echo ""
echo "========================================="
echo "Server setup complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Upload your code to ~/gb-apps"
echo "2. Run: ~/gb-apps/deploy/build-frontends.sh"
echo "3. Run: ~/gb-apps/deploy/start-all.sh"
echo ""
