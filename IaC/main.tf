terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

module "frontend" {
  source       = "./modules/frontend"
  project_name = var.project_name
}
module "rds" {
  source        = "./modules/rds"
  project_name  = var.project_name
  db_username   = var.db_username
  db_password   = var.db_password
}
