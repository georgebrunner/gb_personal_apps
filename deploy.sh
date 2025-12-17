#!/bin/bash
# deploy.sh - Deploy GB Personal Apps to EC2
# Run from Git Bash or WSL: ./deploy.sh <server-ip> <key-file>

set -e

SERVER=$1
KEY=$2
INITIAL=$3

if [ -z "$SERVER" ] || [ -z "$KEY" ]; then
    echo "GB Personal Apps - Deployment Script"
    echo ""
    echo "Usage:"
    echo "  ./deploy.sh <server-ip> <key-file> [--initial]"
    echo ""
    echo "Examples:"
    echo "  # First deployment (includes server setup)"
    echo "  ./deploy.sh 54.123.45.67 ~/keys/my-key.pem --initial"
    echo ""
    echo "  # Regular deployment"
    echo "  ./deploy.sh 54.123.45.67 ~/keys/my-key.pem"
    exit 1
fi

SSH_OPTS="-o StrictHostKeyChecking=no"
REMOTE="ec2-user@$SERVER"

echo "========================================="
echo "GB Personal Apps - Deployment"
echo "========================================="
echo "Server: $SERVER"
echo ""

# Sync code
echo "Syncing code to server..."
rsync -avz --exclude 'node_modules' --exclude '__pycache__' --exclude '.git' --exclude '*.pyc' \
    -e "ssh -i $KEY $SSH_OPTS" \
    . $REMOTE:~/gb-apps/

echo "Code synced!"

# Initial setup if requested
if [ "$INITIAL" == "--initial" ]; then
    echo ""
    echo "Running initial server setup..."
    ssh -i $KEY $SSH_OPTS $REMOTE "chmod +x ~/gb-apps/deploy/*.sh && ~/gb-apps/deploy/server-setup.sh"
    echo "Server setup complete!"
fi

# Build frontends
echo ""
echo "Building frontends..."
ssh -i $KEY $SSH_OPTS $REMOTE "chmod +x ~/gb-apps/deploy/*.sh && ~/gb-apps/deploy/build-frontends.sh"

# Restart services
echo ""
echo "Restarting services..."
ssh -i $KEY $SSH_OPTS $REMOTE "~/gb-apps/deploy/restart-all.sh"

echo ""
echo "========================================="
echo "Deployment complete!"
echo "========================================="
echo ""
echo "Your apps are available at:"
echo "  http://$SERVER/health"
echo "  http://$SERVER/guitar"
echo "  http://$SERVER/todo"
echo "  http://$SERVER/finance"
echo "  http://$SERVER/food"
echo "  http://$SERVER/sales"
echo ""
