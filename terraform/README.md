# Wheelbase Infrastructure as Code

This directory contains Terraform configurations for deploying the Wheelbase NX monorepo applications to AWS.

## Structure

- `/backend`: Terraform configuration for deploying the backend FastAPI service to AWS ECS

## Getting Started

Each subdirectory contains its own detailed README with instructions specific to that deployment.

### Prerequisites

- AWS CLI configured with appropriate credentials
- Terraform installed (version >= 1.0.0)
- Basic understanding of AWS services (ECS, ECR, VPC, etc.)

### Common Setup Steps

1. **Configure AWS CLI**:

   ```bash
   aws configure
   # Make sure to set the region to eu-central-1
   ```

2. **Navigate to the desired deployment directory**:

   ```bash
   cd backend
   ```

3. **Follow the specific instructions** in the README for that deployment.

## CI/CD Integration

This repository includes GitHub Actions workflows for automated deployments. To use them, you'll need to set up the following secrets in your GitHub repository:

- `AWS_ACCESS_KEY_ID`: AWS access key with appropriate permissions
- `AWS_SECRET_ACCESS_KEY`: AWS secret access key
- `AWS_ACCOUNT_ID`: Your AWS account ID (045308480883)
- `AWS_REGION`: AWS region for deployment (eu-central-1)
- `DATABASE_URL`: Database connection URL for the backend
- `SECRET_KEY`: Secret key for the backend application

## Best Practices

- Always review the Terraform plan before applying changes
- Use remote state storage for collaboration (e.g., S3 backend)
- Apply the principle of least privilege for IAM roles and policies
- Regularly update your Terraform version and provider versions
