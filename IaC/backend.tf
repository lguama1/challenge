terraform {
  backend "s3" {
    bucket         = "my-challenge-lina" # manually created
    key            = "env/project.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-locks" # manually created
  }
}
