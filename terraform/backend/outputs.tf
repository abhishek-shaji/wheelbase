output "ecr_repository_url" {
  description = "URL of the ECR repository"
  value       = aws_ecr_repository.backend_repo.repository_url
}

output "ecs_cluster_name" {
  description = "Name of the ECS cluster"
  value       = aws_ecs_cluster.backend_cluster.name
}

output "ecs_service_name" {
  description = "Name of the ECS service"
  value       = aws_ecs_service.backend_service.name
}

output "alb_dns_name" {
  description = "DNS name of the load balancer"
  value       = aws_lb.backend_alb.dns_name
}

output "cloudwatch_log_group" {
  description = "CloudWatch Log Group for the ECS service"
  value       = aws_cloudwatch_log_group.backend_logs.name
} 