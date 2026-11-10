#!/usr/bin/env bash

# Kubernetes Deployment Script for Bash (Linux / macOS / Git Bash / WSL)
# Usage:
#   ./deploy.sh          - Deploys all resources in recommended order
#   ./deploy.sh --delete - Removes all deployed resources
#   ./deploy.sh --status - Checks status of deployed resources

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ "$1" == "--status" ]; then
    echo "=== Kubernetes Resources Status (sai-app namespace) ==="
    kubectl get all,pv,pvc,ingress,secret,configmap -n sai-app
    exit 0
fi

if [ "$1" == "--delete" ]; then
    echo "=== Deleting Kubernetes Resources ==="
    kubectl delete -f "$SCRIPT_DIR/monitoring.yml" --ignore-not-found
    kubectl delete -f "$SCRIPT_DIR/hpa.yml" --ignore-not-found
    kubectl delete -f "$SCRIPT_DIR/ingress.yml" --ignore-not-found
    kubectl delete -f "$SCRIPT_DIR/frontend-deployment.yml" --ignore-not-found
    kubectl delete -f "$SCRIPT_DIR/frontend-service.yml" --ignore-not-found
    kubectl delete -f "$SCRIPT_DIR/backend-deployment.yml" --ignore-not-found
    kubectl delete -f "$SCRIPT_DIR/backend-service.yml" --ignore-not-found
    kubectl delete -f "$SCRIPT_DIR/mongodb-statefulset.yml" --ignore-not-found
    kubectl delete -f "$SCRIPT_DIR/mongodb-service.yml" --ignore-not-found
    kubectl delete -f "$SCRIPT_DIR/redis.yml" --ignore-not-found
    kubectl delete -f "$SCRIPT_DIR/mongodb-pvc.yml" --ignore-not-found
    kubectl delete -f "$SCRIPT_DIR/mongodb-pv.yml" --ignore-not-found
    kubectl delete -f "$SCRIPT_DIR/backend-configmap.yml" --ignore-not-found

    if [ -f "$SCRIPT_DIR/secrets.yml" ]; then
        kubectl delete -f "$SCRIPT_DIR/secrets.yml" --ignore-not-found
    elif [ -f "$SCRIPT_DIR/secretes.yml" ]; then
        kubectl delete -f "$SCRIPT_DIR/secretes.yml" --ignore-not-found
    fi

    kubectl delete -f "$SCRIPT_DIR/namespace.yml" --ignore-not-found
    echo "Cleanup completed successfully!"
    exit 0
fi

echo "=== Deploying Kubernetes Resources ==="

echo "[1/8] Applying Namespace..."
kubectl apply -f "$SCRIPT_DIR/namespace.yml"

echo "[2/8] Applying ConfigMaps and Secrets..."
kubectl apply -f "$SCRIPT_DIR/backend-configmap.yml"
if [ -f "$SCRIPT_DIR/secrets.yml" ]; then
    kubectl apply -f "$SCRIPT_DIR/secrets.yml"
elif [ -f "$SCRIPT_DIR/secretes.yml" ]; then
    kubectl apply -f "$SCRIPT_DIR/secretes.yml"
else
    echo "  Note: secrets.yml not found. Applying secrets.example.yml..."
    kubectl apply -f "$SCRIPT_DIR/secrets.example.yml"
fi

echo "[3/8] Applying Persistent Storage..."
kubectl apply -f "$SCRIPT_DIR/mongodb-pv.yml"
kubectl apply -f "$SCRIPT_DIR/mongodb-pvc.yml"

echo "[4/8] Applying Database Services (MongoDB & Redis)..."
kubectl apply -f "$SCRIPT_DIR/mongodb-service.yml"
kubectl apply -f "$SCRIPT_DIR/mongodb-statefulset.yml"
kubectl apply -f "$SCRIPT_DIR/redis.yml"

echo "[5/8] Applying Backend Service and Deployment..."
kubectl apply -f "$SCRIPT_DIR/backend-service.yml"
kubectl apply -f "$SCRIPT_DIR/backend-deployment.yml"

echo "[6/8] Applying Frontend Service and Deployment..."
kubectl apply -f "$SCRIPT_DIR/frontend-service.yml"
kubectl apply -f "$SCRIPT_DIR/frontend-deployment.yml"

echo "[7/8] Applying Ingress and HPA..."
kubectl apply -f "$SCRIPT_DIR/ingress.yml"
kubectl apply -f "$SCRIPT_DIR/hpa.yml"

echo "[8/8] Applying Monitoring Stack..."
kubectl apply -f "$SCRIPT_DIR/monitoring.yml"

echo ""
echo "=== Deployment Complete ==="
echo "Checking pod status:"
kubectl get pods -n sai-app
