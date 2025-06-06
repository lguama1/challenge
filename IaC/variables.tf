variable "aws_region" {
  description = "AWS region"
  default     = "us-east-1"
}

variable "project_name" {
  description = "Nombre del proyecto"
  default     = "portal-challenge"
}

variable "db_username" {
  default = "postgres"
}

variable "db_password" {
  description = "DB master password"
  sensitive   = true
}

variable "database_url" {
  description = "DB master password"
  sensitive   = true
}
