# Backend Deployment to AWS ECS

This directory contains Terraform configuration to deploy the backend FastAPI application to AWS ECS using Fargate.

## Prerequisites

- AWS CLI configured with appropriate credentials
- Terraform installed (version >= 1.0.0)
- Docker installed (for building and pushing container images)

## Environment Setup

### 1. Create AWS Systems Manager (SSM) Parameters

Before applying the Terraform configuration, you need to create SSM parameters for your environment variables:

```bash
# Create DATABASE_URL parameter
aws ssm put-parameter \
    --name "/wheelbase/DATABASE_URL" \
    --value "postgresql://username:password@your-db-host:5432/dbname" \
    --type SecureString \
    --description "Database connection URL for the backend application" \
    --region eu-central-1

# Create SECRET_KEY parameter
aws ssm put-parameter \
    --name "/wheelbase/SECRET_KEY" \
    --value "your-secret-key-here" \
    --type SecureString \
    --description "Secret key for FastAPI application" \
    --region eu-central-1
```

### 2. Configure Terraform Variables

Copy the example tfvars file and fill in your values:

```bash
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your actual values
```

## Deployment Steps

### 1. Build and Push Docker Image

```bash
# Login to ECR (after you've applied Terraform to create the repository)
aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin 045308480883.dkr.ecr.eu-central-1.amazonaws.com

# Build the Docker image
docker build -t wheelbase-backend:latest ../../apps/backend/

# Tag the image
docker tag wheelbase-backend:latest 045308480883.dkr.ecr.eu-central-1.amazonaws.com/wheelbase-backend:latest

# Push the image
docker push 045308480883.dkr.ecr.eu-central-1.amazonaws.com/wheelbase-backend:latest
```

### 2. Apply Terraform Configuration

```bash
# Initialize Terraform
terraform init

# Check the plan
terraform plan

# Apply the changes
terraform apply
```

### 3. Verify Deployment

After successful deployment, Terraform will output the load balancer DNS name. Use this to access your API:

```
http://<alb_dns_name>/docs
```

## GitHub Actions Integration

This repository includes a GitHub Actions workflow that automates the build, push, and deployment process. The workflow uses environment variables from GitHub secrets.

Required GitHub secrets:

- `AWS_ACCESS_KEY_ID`: AWS access key with appropriate permissions
- `AWS_SECRET_ACCESS_KEY`: AWS secret access key
- `AWS_ACCOUNT_ID`: Your AWS account ID (045308480883)
- `AWS_REGION`: AWS region for deployment (eu-central-1)
- `DATABASE_URL`: Database connection URL
- `SECRET_KEY`: Secret key for the application

## Clean Up

To remove all resources created by this Terraform configuration:

```bash
terraform destroy
```
