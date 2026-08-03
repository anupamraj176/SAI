# Kubernetes Deployment Script for Windows (PowerShell)
# Usage:
#   .\deploy.ps1           - Deploys all resources in recommended order
#   .\deploy.ps1 -Delete    - Removes all deployed resources
#   .\deploy.ps1 -Status    - Checks status of deployed resources

param (
    [switch]$Delete,
    [switch]$Status
)

$K8S_DIR = $PSScriptRoot

if ($Status) {
    Write-Host "=== Kubernetes Resources Status (sai-app namespace) ===" -ForegroundColor Cyan
    kubectl get all,pv,pvc,ingress,secret,configmap -n sai-app
    exit 0
}

if ($Delete) {
    Write-Host "=== Deleting Kubernetes Resources ===" -ForegroundColor Red
    kubectl delete -f "$K8S_DIR/ingress.yml" --ignore-not-found
    kubectl delete -f "$K8S_DIR/frontend-deployment.yml" --ignore-not-found
    kubectl delete -f "$K8S_DIR/frontend-service.yml" --ignore-not-found
    kubectl delete -f "$K8S_DIR/backend-deployment.yml" --ignore-not-found
    kubectl delete -f "$K8S_DIR/backend-service.yml" --ignore-not-found
    kubectl delete -f "$K8S_DIR/mongodb-deployment.yml" --ignore-not-found
    kubectl delete -f "$K8S_DIR/mongodb-service.yml" --ignore-not-found
    kubectl delete -f "$K8S_DIR/mongodb-pvc.yml" --ignore-not-found
    kubectl delete -f "$K8S_DIR/mongodb-pv.yml" --ignore-not-found
    kubectl delete -f "$K8S_DIR/backend-configmap.yml" --ignore-not-found
    
    if (Test-Path "$K8S_DIR/secretes.yml") {
        kubectl delete -f "$K8S_DIR/secretes.yml" --ignore-not-found
    }
    
    kubectl delete -f "$K8S_DIR/namespace.yml" --ignore-not-found
    Write-Host "Cleanup completed successfully!" -ForegroundColor Green
    exit 0
}

Write-Host "=== Deploying Kubernetes Resources ===" -ForegroundColor Green

# 1. Namespace
Write-Host "[1/7] Applying Namespace..." -ForegroundColor Yellow
kubectl apply -f "$K8S_DIR/namespace.yml"

# 2. ConfigMaps and Secrets
Write-Host "[2/7] Applying ConfigMaps and Secrets..." -ForegroundColor Yellow
kubectl apply -f "$K8S_DIR/backend-configmap.yml"
if (Test-Path "$K8S_DIR/secretes.yml") {
    kubectl apply -f "$K8S_DIR/secretes.yml"
} else {
    Write-Host "  Note: secretes.yml not found. Applying secretes.example.yml..." -ForegroundColor DarkYellow
    kubectl apply -f "$K8S_DIR/secretes.example.yml"
}

# 3. Persistent Volumes & PVCs
Write-Host "[3/7] Applying Persistent Storage..." -ForegroundColor Yellow
kubectl apply -f "$K8S_DIR/mongodb-pv.yml"
kubectl apply -f "$K8S_DIR/mongodb-pvc.yml"

# 4. Database (MongoDB)
Write-Host "[4/7] Applying MongoDB Service and Deployment..." -ForegroundColor Yellow
kubectl apply -f "$K8S_DIR/mongodb-service.yml"
kubectl apply -f "$K8S_DIR/mongodb-deployment.yml"

# 5. Backend
Write-Host "[5/7] Applying Backend Service and Deployment..." -ForegroundColor Yellow
kubectl apply -f "$K8S_DIR/backend-service.yml"
kubectl apply -f "$K8S_DIR/backend-deployment.yml"

# 6. Frontend
Write-Host "[6/7] Applying Frontend Service and Deployment..." -ForegroundColor Yellow
kubectl apply -f "$K8S_DIR/frontend-service.yml"
kubectl apply -f "$K8S_DIR/frontend-deployment.yml"

# 7. Ingress
Write-Host "[7/7] Applying Ingress..." -ForegroundColor Yellow
kubectl apply -f "$K8S_DIR/ingress.yml"

Write-Host "`n=== Deployment Complete ===" -ForegroundColor Green
Write-Host "Checking pod status:" -ForegroundColor Cyan
kubectl get pods -n sai-app
