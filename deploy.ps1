# deploy.ps1 - Deploy GB Personal Apps to EC2
# Run from PowerShell: .\deploy.ps1

param(
    [string]$Server = "",      # EC2 IP or hostname
    [string]$KeyFile = "",     # Path to .pem key file
    [switch]$Initial,          # First-time setup
    [switch]$BuildOnly,        # Only rebuild frontends
    [switch]$Help
)

if ($Help -or (-not $Server) -or (-not $KeyFile)) {
    Write-Host @"
GB Personal Apps - Deployment Script

Usage:
    .\deploy.ps1 -Server <IP> -KeyFile <path-to-key.pem> [-Initial] [-BuildOnly]

Parameters:
    -Server     EC2 instance IP address or hostname (required)
    -KeyFile    Path to your .pem SSH key file (required)
    -Initial    Run first-time server setup (installs dependencies)
    -BuildOnly  Only rebuild frontends, don't sync code
    -Help       Show this help message

Examples:
    # First deployment (includes server setup)
    .\deploy.ps1 -Server 54.123.45.67 -KeyFile C:\keys\my-key.pem -Initial

    # Regular deployment (sync code + restart)
    .\deploy.ps1 -Server 54.123.45.67 -KeyFile C:\keys\my-key.pem

    # Just rebuild frontends
    .\deploy.ps1 -Server 54.123.45.67 -KeyFile C:\keys\my-key.pem -BuildOnly
"@
    exit 0
}

$ErrorActionPreference = "Stop"

# Validate key file exists
if (-not (Test-Path $KeyFile)) {
    Write-Error "Key file not found: $KeyFile"
    exit 1
}

$SSH = "ssh -i `"$KeyFile`" -o StrictHostKeyChecking=no ec2-user@$Server"
$SCP = "scp -i `"$KeyFile`" -o StrictHostKeyChecking=no"
$RSYNC = "rsync -avz --exclude 'node_modules' --exclude '__pycache__' --exclude '.git' --exclude '*.pyc' -e `"ssh -i '$KeyFile' -o StrictHostKeyChecking=no`""

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "GB Personal Apps - Deployment" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Server: $Server"
Write-Host ""

# Step 1: Sync code to server
if (-not $BuildOnly) {
    Write-Host "Syncing code to server..." -ForegroundColor Yellow

    # Use rsync if available (Git Bash, WSL), otherwise fall back to scp
    $rsyncAvailable = Get-Command rsync -ErrorAction SilentlyContinue

    if ($rsyncAvailable) {
        # Convert Windows path to Unix-style for rsync
        $sourcePath = (Get-Location).Path -replace '\\', '/'
        Invoke-Expression "$RSYNC `"$sourcePath/`" ec2-user@${Server}:~/gb-apps/"
    } else {
        Write-Host "rsync not found, using scp (slower)..." -ForegroundColor Gray

        # Create zip excluding unnecessary files
        $tempZip = "$env:TEMP\gb-apps-deploy.zip"
        if (Test-Path $tempZip) { Remove-Item $tempZip }

        Write-Host "Creating deployment package..."
        Compress-Archive -Path "gb-*", "deploy", "shared" -DestinationPath $tempZip -Force

        Write-Host "Uploading to server..."
        Invoke-Expression "$SCP `"$tempZip`" ec2-user@${Server}:~/gb-apps-deploy.zip"

        # Extract on server
        Invoke-Expression "$SSH `"cd ~ && rm -rf gb-apps && unzip -q gb-apps-deploy.zip -d gb-apps && rm gb-apps-deploy.zip`""

        Remove-Item $tempZip
    }
    Write-Host "Code synced!" -ForegroundColor Green
}

# Step 2: Initial setup (if requested)
if ($Initial) {
    Write-Host ""
    Write-Host "Running initial server setup..." -ForegroundColor Yellow
    Invoke-Expression "$SSH `"chmod +x ~/gb-apps/deploy/*.sh && ~/gb-apps/deploy/server-setup.sh`""
    Write-Host "Server setup complete!" -ForegroundColor Green
}

# Step 3: Build frontends
Write-Host ""
Write-Host "Building frontends on server..." -ForegroundColor Yellow
Invoke-Expression "$SSH `"chmod +x ~/gb-apps/deploy/*.sh && ~/gb-apps/deploy/build-frontends.sh`""
Write-Host "Frontends built!" -ForegroundColor Green

# Step 4: Restart services
if (-not $BuildOnly) {
    Write-Host ""
    Write-Host "Restarting services..." -ForegroundColor Yellow
    Invoke-Expression "$SSH `"~/gb-apps/deploy/restart-all.sh`""
    Write-Host "Services restarted!" -ForegroundColor Green
}

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Deployment complete!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your apps are available at:"
Write-Host "  http://$Server/health"
Write-Host "  http://$Server/guitar"
Write-Host "  http://$Server/todo"
Write-Host "  http://$Server/finance"
Write-Host "  http://$Server/food"
Write-Host "  http://$Server/sales"
Write-Host ""
