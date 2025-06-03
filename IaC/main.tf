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
  source       = "./modules/rds"
  project_name = var.project_name
  db_username  = var.db_username
  db_password  = var.db_password
}

module "lambda_backend" {
  source      = "./modules/lambda"
  lambda_name = "portal-challenge-mngr"
  source_path = "lambda.zip"
  handler     = "index.handler"
  environment_variables = {
    DB_HOST      = "tu-db-endpoint"
    DB_USER      = "postgres"
    DB_PASSWORD  = var.db_password
    DATABASE_URL = var.database_url
  }
}

module "apigateway" {
  source        = "./modules/apigateway"
  api_name      = "api-portal-challenge"
  oas_file_path = "${path.module}/modules/apigateway/oas.yaml"
  lambda        = module.lambda_backend
}
