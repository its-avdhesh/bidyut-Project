#!/bin/bash

# AWS Deployment Script for Bidyut Project
# This script automates the deployment process to AWS EC2

set -e

# Configuration
AWS_REGION="us-east-1"
ECR_REPOSITORY="bidyut-project"
EC2_INSTANCE_IP="your-ec2-public-ip"
APP_NAME="bidyut-app"

echo "🚀 Starting AWS Deployment Process..."

# Step 1: Build Docker image
echo "📦 Building Docker image..."
docker build -t $ECR_REPOSITORY .

# Step 2: Authenticate with ECR
echo "🔐 Authenticating with AWS ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $(aws sts get-caller-identity --query Account --output text).dkr.ecr.$AWS_REGION.amazonaws.com

# Step 3: Get AWS Account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_URI="$ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"

# Step 4: Tag and push to ECR
echo "📤 Pushing image to ECR..."
docker tag $ECR_REPOSITORY:latest $ECR_URI/$ECR_REPOSITORY:latest
docker push $ECR_URI/$ECR_REPOSITORY:latest

# Step 5: Deploy to EC2
echo "🌐 Deploying to EC2 instance..."
ssh -o StrictHostKeyChecking=no -i ~/.ssh/your-key.pem ec2-user@$EC2_INSTANCE_IP << EOF
    # Pull latest image
    docker pull $ECR_URI/$ECR_REPOSITORY:latest
    
    # Stop existing container
    docker stop $APP_NAME || true
    docker rm $APP_NAME || true
    
    # Run new container
    docker run -d -p 3000:3000 --name $APP_NAME --restart unless-stopped $ECR_URI/$ECR_REPOSITORY:latest
    
    echo "✅ Deployment completed successfully!"
EOF

echo "🎉 Deployment completed! Your application is now live at http://$EC2_INSTANCE_IP:3000"
