variable "aws_region" {
  description = "AWS region to deploy resources to"
  type        = string
  default     = "eu-central-1"
}

variable "aws_account_id" {
  description = "AWS account ID"
  type        = string
}

variable "environment" {
  description = "Deployment environment (e.g., dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "service_name" {
  description = "Name of the ECS service"
  type        = string
  default     = "wheelbase-backend"
}

variable "ecr_repository_name" {
  description = "Name of the ECR repository"
  type        = string
  default     = "wheelbase-backend"
}

variable "ecs_cluster_name" {
  description = "Name of the ECS cluster"
  type        = string
  default     = "wheelbase-cluster"
}

variable "image_tag" {
  description = "Docker image tag to deploy"
  type        = string
  default     = "latest"
}

variable "container_cpu" {
  description = "CPU units for the container"
  type        = number
  default     = 256
}

variable "container_memory" {
  description = "Memory for the container in MiB"
  type        = number
  default     = 512
}

variable "service_desired_count" {
  description = "Desired number of tasks to run"
  type        = number
  default     = 1
}

variable "ssm_parameter_prefix" {
  description = "Prefix for SSM parameters to store secrets"
  type        = string
  default     = "wheelbase"
}

variable "create_vpc" {
  description = "Whether to create a new VPC or use an existing one"
  type        = bool
  default     = true
}

variable "vpc_id" {
  description = "ID of the existing VPC if not creating a new one"
  type        = string
  default     = ""
}

variable "subnet_ids" {
  description = "List of subnet IDs if using an existing VPC"
  type        = list(string)
  default     = []
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "List of availability zones to use"
  type        = list(string)
  default     = ["eu-central-1a", "eu-central-1b"]
} 