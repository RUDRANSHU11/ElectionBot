#!/bin/bash
# VoteReady - Google Cloud Run Deployment Script
# Usage: bash deploy.sh YOUR_GCP_PROJECT_ID

set -e

PROJECT_ID=${1:-"your-gcp-project-id"}
REGION="us-central1"
BACKEND_IMAGE="gcr.io/$PROJECT_ID/voteready-backend"
FRONTEND_IMAGE="gcr.io/$PROJECT_ID/voteready-frontend"

echo "=== VoteReady Cloud Run Deployment ==="
echo "Project: $PROJECT_ID | Region: $REGION"
echo ""

# Build & push backend
echo ">>> Building backend..."
gcloud builds submit --tag $BACKEND_IMAGE ./backend

echo ">>> Deploying backend to Cloud Run..."
gcloud run deploy voteready-backend \
  --image $BACKEND_IMAGE \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars "OPENAI_API_KEY=$OPENAI_API_KEY,MONGO_URI=$MONGO_URI" \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 10

BACKEND_URL=$(gcloud run services describe voteready-backend \
  --platform managed --region $REGION \
  --format 'value(status.url)')

echo ">>> Backend live at: $BACKEND_URL"

# Build & push frontend
echo ">>> Building frontend..."
gcloud builds submit \
  --tag $FRONTEND_IMAGE \
  --substitutions "_API_URL=$BACKEND_URL" \
  ./frontend

echo ">>> Deploying frontend to Cloud Run..."
gcloud run deploy voteready-frontend \
  --image $FRONTEND_IMAGE \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars "NEXT_PUBLIC_API_URL=$BACKEND_URL" \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 10

FRONTEND_URL=$(gcloud run services describe voteready-frontend \
  --platform managed --region $REGION \
  --format 'value(status.url)')

echo ""
echo "=== DEPLOYMENT COMPLETE ==="
echo "Frontend: $FRONTEND_URL"
echo "Backend:  $BACKEND_URL"
echo "Submit this URL: $FRONTEND_URL"
