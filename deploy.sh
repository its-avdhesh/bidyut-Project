#!/bin/bash

# AWS Deployment Script for Bidyut Project
# This script automates the deployment process to AWS EC2

set -e

# Configuration
AWS_REGION="us-east-1"
ECR_REPOSITORY="bidyut-project"
EC2_INSTANCE_IP="your-ec2-public-ip"
APP_NAME="bidyut-app"
ENV_FILE="/home/ec2-user/.env"

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
    
    # Run new container with environment variables
    docker run -d \
        --name $APP_NAME \
        -p 3000:3000 \
        --restart unless-stopped \
        --env-file $ENV_FILE \
        $ECR_URI/$ECR_REPOSITORY:latest
    
    # Wait for container to start
    sleep 5
    
    # Check container status
    if docker ps | grep -q $APP_NAME; then
        echo "✅ Container is running successfully"
        
        # Health check
        sleep 10
        if curl -f http://localhost:3000 > /dev/null 2>&1; then
            echo "✅ Health check passed - Application is responding"
        else
            echo "⚠️  Health check failed - Checking logs..."
            docker logs $APP_NAME
        fi
    else
        echo "❌ Container failed to start - Checking logs..."
        docker logs $APP_NAME
        exit 1
    fi
    
    echo "✅ Deployment completed successfully!"
EOF

echo "🎉 Deployment completed! Your application is now live at http://$EC2_INSTANCE_IP:3000"
echo "📋 To check logs: ssh -i ~/.ssh/your-key.pem ec2-user@$EC2_INSTANCE_IP 'docker logs $APP_NAME'"
