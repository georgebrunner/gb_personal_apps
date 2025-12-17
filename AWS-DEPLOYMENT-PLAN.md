# GB Personal Apps - Simple AWS Deployment Plan

## Overview

Deploy all 6 personal apps to AWS using the simplest, most cost-effective approach: **a single EC2 instance** running everything.

**Estimated Monthly Cost: $3-5** (or free with AWS Free Tier)

---

## Architecture

```
                    Internet
                        │
                        ▼
              ┌─────────────────┐
              │   EC2 Instance  │
              │  (t2.micro/t3)  │
              │                 │
              │  ┌───────────┐  │
              │  │   nginx   │◄─┼── Port 80/443
              │  └─────┬─────┘  │
              │        │        │
              │   ┌────┴────┐   │
              │   ▼         ▼   │
              │ /health  /api/* │
              │ /guitar   etc   │
              │ /todo           │
              │ /finance        │
              │ /food           │
              │ /sales          │
              │                 │
              │  Backends:      │
              │  :8000-8005     │
              └─────────────────┘
                        │
                        ▼
              ┌─────────────────┐
              │   EBS Volume    │
              │  (JSON files)   │
              └─────────────────┘
```

---

## Requirements

### Local Development (No Changes Needed)
Your apps already work locally with:
- Python 3.11+
- Node.js 18+
- Each backend runs on its own port (8000-8005)
- Frontends use Vite dev server

### AWS Resources Needed
1. **EC2 Instance** - t2.micro (Free Tier) or t3.micro ($3-5/month)
2. **Elastic IP** - Free while attached to running instance
3. **Security Group** - Allow HTTP (80), HTTPS (443), SSH (22)
4. **Optional: Route 53** - Custom domain (~$0.50/month for hosted zone)

### Software on EC2
- Amazon Linux 2023 (free, lightweight)
- Python 3.11
- Node.js 18 (for building frontends)
- nginx (reverse proxy)
- systemd (process management - built-in)

---

## Development Workflow

### Current (Local) - No Changes
```bash
# Terminal 1: Start all backends
start-all.bat

# Terminal 2: Start frontend dev server (any app)
cd gb-health/frontend && npm run dev
```

### Deployment to AWS
```bash
# From your local machine - one command deploys everything
./deploy.sh
```

---

## Deployment Plan

### Phase 1: AWS Setup (One-time, ~15 min)

1. **Create EC2 Instance**
   - AMI: Amazon Linux 2023
   - Type: t2.micro (Free Tier) or t3.micro
   - Storage: 8GB EBS (default)
   - Security Group: Allow SSH (22), HTTP (80)

2. **Attach Elastic IP**
   - Create and associate (free while instance running)

3. **SSH and Install Dependencies**
   ```bash
   # Update system
   sudo dnf update -y

   # Install Node.js 18
   curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
   sudo dnf install -y nodejs

   # Install Python 3.11
   sudo dnf install -y python3.11 python3.11-pip

   # Install nginx and git
   sudo dnf install -y nginx git

   # Install Python packages
   sudo pip3.11 install fastapi uvicorn pydantic python-dateutil
   ```

### Phase 2: Deploy Code

1. **Clone/Upload Your Code**
   ```bash
   cd ~
   git clone <your-repo> gb-apps
   # OR upload via scp/rsync
   ```

2. **Build All Frontends**
   ```bash
   cd ~/gb-apps
   for app in health guitar todo finance food sales; do
     cd gb-$app/frontend && npm install && npm run build && cd ../..
   done
   ```

3. **Configure nginx** (see nginx.conf below)

4. **Create systemd Services** (see services below)

5. **Start Everything**
   ```bash
   sudo systemctl start nginx
   sudo systemctl start gb-health-api gb-guitar-api gb-finance-api gb-todo-api gb-food-api gb-sales-api
   ```

### Phase 3: Access Your Apps

- `http://YOUR-ELASTIC-IP/health`
- `http://YOUR-ELASTIC-IP/guitar`
- `http://YOUR-ELASTIC-IP/todo`
- `http://YOUR-ELASTIC-IP/finance`
- `http://YOUR-ELASTIC-IP/food`
- `http://YOUR-ELASTIC-IP/sales`

---

## Configuration Files to Create

### 1. nginx.conf

```nginx
# /etc/nginx/nginx.conf
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    sendfile on;
    keepalive_timeout 65;

    server {
        listen 80;
        server_name _;

        # Redirect root to health app
        location = / {
            return 301 /health;
        }

        # Static frontends
        location /health {
            alias /home/ec2-user/gb-apps/gb-health/frontend/dist;
            try_files $uri $uri/ /health/index.html;
        }

        location /guitar {
            alias /home/ec2-user/gb-apps/gb-guitar/frontend/dist;
            try_files $uri $uri/ /guitar/index.html;
        }

        location /todo {
            alias /home/ec2-user/gb-apps/gb-todo/frontend/dist;
            try_files $uri $uri/ /todo/index.html;
        }

        location /finance {
            alias /home/ec2-user/gb-apps/gb-finance/frontend/dist;
            try_files $uri $uri/ /finance/index.html;
        }

        location /food {
            alias /home/ec2-user/gb-apps/gb-food/frontend/dist;
            try_files $uri $uri/ /food/index.html;
        }

        location /sales {
            alias /home/ec2-user/gb-apps/gb-sales/frontend/dist;
            try_files $uri $uri/ /sales/index.html;
        }

        # API reverse proxies
        location /api/health/ {
            proxy_pass http://127.0.0.1:8000/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        location /api/guitar/ {
            proxy_pass http://127.0.0.1:8001/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        location /api/finance/ {
            proxy_pass http://127.0.0.1:8002/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        location /api/todo/ {
            proxy_pass http://127.0.0.1:8003/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        location /api/food/ {
            proxy_pass http://127.0.0.1:8004/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        location /api/sales/ {
            proxy_pass http://127.0.0.1:8005/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
```

### 2. Systemd Service Template

Create one for each app (health, guitar, todo, finance, food, sales):

```ini
# /etc/systemd/system/gb-health-api.service
[Unit]
Description=GB Health API
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/home/ec2-user/gb-apps/gb-health/backend
ExecStart=/usr/bin/python3.11 -m uvicorn app.main:app --host 127.0.0.1 --port 8000
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```

---

## Deployment Script (deploy.sh)

Create this locally to deploy with one command:

```bash
#!/bin/bash
# deploy.sh - Run from your local machine

SERVER="ec2-user@YOUR-ELASTIC-IP"
KEY="path/to/your-key.pem"
REMOTE_DIR="/home/ec2-user/gb-apps"

echo "Syncing code to server..."
rsync -avz --exclude 'node_modules' --exclude '__pycache__' --exclude '.git' \
  -e "ssh -i $KEY" \
  . $SERVER:$REMOTE_DIR

echo "Building frontends and restarting services..."
ssh -i $KEY $SERVER << 'EOF'
cd ~/gb-apps

# Build any changed frontends
for app in health guitar todo finance food sales; do
  if [ -f "gb-$app/frontend/package.json" ]; then
    cd gb-$app/frontend
    npm install --silent
    npm run build --silent
    cd ../..
  fi
done

# Restart all backend services
sudo systemctl restart gb-health-api gb-guitar-api gb-finance-api gb-todo-api gb-food-api gb-sales-api

echo "Deployment complete!"
EOF
```

---

## Cost Breakdown

| Resource | Monthly Cost |
|----------|--------------|
| EC2 t2.micro (Free Tier year 1) | $0 |
| EC2 t3.micro (after Free Tier) | ~$3.50 |
| Elastic IP (attached) | $0 |
| EBS 8GB storage | ~$0.80 |
| Data transfer (minimal) | ~$0.10 |
| **Total (Free Tier)** | **~$1** |
| **Total (after Free Tier)** | **~$4.50** |

---

## Optional Enhancements

### Custom Domain (Route 53)
- Register domain: $12/year for .com
- Hosted zone: $0.50/month
- Point A record to Elastic IP

### HTTPS (Free with Let's Encrypt)
```bash
sudo dnf install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### Automated Backups
```bash
# Add to crontab - daily backup to local zip
0 2 * * * tar -czf ~/backups/gb-data-$(date +\%Y\%m\%d).tar.gz ~/gb-apps/*/data/
```

---

## Quick Reference Commands

### On Server
```bash
# Check service status
sudo systemctl status gb-health-api

# View logs
sudo journalctl -u gb-health-api -f

# Restart all services
sudo systemctl restart gb-health-api gb-guitar-api gb-finance-api gb-todo-api gb-food-api gb-sales-api

# Restart nginx
sudo systemctl restart nginx

# Check nginx config
sudo nginx -t
```

### From Local Machine
```bash
# Deploy changes
./deploy.sh

# SSH to server
ssh -i your-key.pem ec2-user@YOUR-IP

# Copy single file
scp -i your-key.pem file.txt ec2-user@YOUR-IP:~/gb-apps/
```

---

## Summary

This approach:
- **Simple**: Single server, no containers, no serverless complexity
- **Cheap**: $0-5/month depending on Free Tier status
- **Familiar**: Same nginx/systemd stack used by most web apps
- **Easy to maintain**: SSH in, make changes, restart services
- **No vendor lock-in**: Standard Linux server, easy to migrate anywhere
