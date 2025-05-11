terraform {
  backend "s3" {
    bucket         = "wheelbase-terraform-state"
    key            = "backend/terraform.tfstate"
    region         = "eu-central-1"
    encrypt        = true
    dynamodb_table = "wheelbase-terraform-locks"
  }
}