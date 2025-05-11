provider "aws" {
  region = var.aws_region
}

# ECR Repository for Docker images
resource "aws_ecr_repository" "backend_repo" {
  name                 = var.ecr_repository_name
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

# ECS Cluster
resource "aws_ecs_cluster" "backend_cluster" {
  name = var.ecs_cluster_name
}

# CloudWatch Log Group for ECS
resource "aws_cloudwatch_log_group" "backend_logs" {
  name              = "/ecs/${var.service_name}"
  retention_in_days = 30
}

# ECS Task Execution Role
resource "aws_iam_role" "ecs_task_execution_role" {
  name = "${var.service_name}-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}

# Attach the required policy to the task execution role
resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# SSM Parameter access policy for environment variables
resource "aws_iam_policy" "ssm_parameter_access" {
  name        = "${var.service_name}-ssm-policy"
  description = "Allow access to SSM parameters for environment variables"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "ssm:GetParameters",
          "ssm:GetParameter"
        ]
        Effect   = "Allow"
        Resource = "arn:aws:ssm:${var.aws_region}:${var.aws_account_id}:parameter/${var.ssm_parameter_prefix}/*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ssm_parameter_access_attachment" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = aws_iam_policy.ssm_parameter_access.arn
}

# ECS Task Definition
resource "aws_ecs_task_definition" "backend_task" {
  family                   = var.service_name
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.container_cpu
  memory                   = var.container_memory
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    {
      name      = var.service_name
      image     = "${aws_ecr_repository.backend_repo.repository_url}:${var.image_tag}"
      essential = true
      
      portMappings = [
        {
          containerPort = 8000
          hostPort      = 8000
          protocol      = "tcp"
        }
      ]
      
      environment = [
        {
          name  = "ENVIRONMENT",
          value = var.environment
        }
      ]
      
      secrets = [
        {
          name      = "DATABASE_URL"
          valueFrom = "arn:aws:ssm:${var.aws_region}:${var.aws_account_id}:parameter/${var.ssm_parameter_prefix}/DATABASE_URL"
        },
        {
          name      = "SECRET_KEY"
          valueFrom = "arn:aws:ssm:${var.aws_region}:${var.aws_account_id}:parameter/${var.ssm_parameter_prefix}/SECRET_KEY"
        }
      ]
      
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.backend_logs.name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])
}

# VPC configuration for Fargate
resource "aws_vpc" "main" {
  count = var.create_vpc ? 1 : 0
  
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true
  
  tags = {
    Name = "${var.service_name}-vpc"
  }
}

# Public subnets
resource "aws_subnet" "public" {
  count = var.create_vpc ? length(var.availability_zones) : 0
  
  vpc_id            = aws_vpc.main[0].id
  cidr_block        = cidrsubnet(var.vpc_cidr, 8, count.index)
  availability_zone = var.availability_zones[count.index]
  
  tags = {
    Name = "${var.service_name}-public-subnet-${count.index + 1}"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "igw" {
  count = var.create_vpc ? 1 : 0
  
  vpc_id = aws_vpc.main[0].id
  
  tags = {
    Name = "${var.service_name}-igw"
  }
}

# Route table
resource "aws_route_table" "public" {
  count = var.create_vpc ? 1 : 0
  
  vpc_id = aws_vpc.main[0].id
  
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw[0].id
  }
  
  tags = {
    Name = "${var.service_name}-public-rt"
  }
}

# Route table association
resource "aws_route_table_association" "public" {
  count = var.create_vpc ? length(var.availability_zones) : 0
  
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public[0].id
}

# Security group for ECS
resource "aws_security_group" "ecs_sg" {
  name        = "${var.service_name}-ecs-sg"
  description = "Security group for ECS service"
  vpc_id      = var.create_vpc ? aws_vpc.main[0].id : var.vpc_id
  
  ingress {
    from_port   = 8000
    to_port     = 8000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  tags = {
    Name = "${var.service_name}-ecs-sg"
  }
}

# ALB Security Group
resource "aws_security_group" "alb_sg" {
  name        = "${var.service_name}-alb-sg"
  description = "Security group for application load balancer"
  vpc_id      = var.create_vpc ? aws_vpc.main[0].id : var.vpc_id
  
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  tags = {
    Name = "${var.service_name}-alb-sg"
  }
}

# Application Load Balancer
resource "aws_lb" "backend_alb" {
  name               = "${var.service_name}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = var.create_vpc ? aws_subnet.public[*].id : var.subnet_ids
  
  enable_deletion_protection = false
  
  tags = {
    Name = "${var.service_name}-alb"
  }
}

# Target Group
resource "aws_lb_target_group" "backend_tg" {
  name        = "${var.service_name}-tg"
  port        = 8000
  protocol    = "HTTP"
  vpc_id      = var.create_vpc ? aws_vpc.main[0].id : var.vpc_id
  target_type = "ip"
  
  health_check {
    enabled             = true
    interval            = 30
    path                = "/docs"
    port                = "traffic-port"
    healthy_threshold   = 3
    unhealthy_threshold = 3
    timeout             = 5
    protocol            = "HTTP"
    matcher             = "200"
  }
}

# ALB Listener
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.backend_alb.arn
  port              = 80
  protocol          = "HTTP"
  
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend_tg.arn
  }
}

# ECS Service
resource "aws_ecs_service" "backend_service" {
  name            = var.service_name
  cluster         = aws_ecs_cluster.backend_cluster.id
  task_definition = aws_ecs_task_definition.backend_task.arn
  desired_count   = var.service_desired_count
  launch_type     = "FARGATE"
  
  network_configuration {
    subnets          = var.create_vpc ? aws_subnet.public[*].id : var.subnet_ids
    security_groups  = [aws_security_group.ecs_sg.id]
    assign_public_ip = true
  }
  
  load_balancer {
    target_group_arn = aws_lb_target_group.backend_tg.arn
    container_name   = var.service_name
    container_port   = 8000
  }
  
  depends_on = [aws_lb_listener.http]
} 