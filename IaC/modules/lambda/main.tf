resource "aws_iam_role" "lambda_exec" {
  name = "${var.lambda_name}-exec-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow",
      Principal = {
        Service = "lambda.amazonaws.com"
      },
      Action = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "basic_execution" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_lambda_function" "portal_challenge_mngr" {
  function_name    = var.lambda_name
  role             = aws_iam_role.lambda_exec.arn
  handler          = var.handler
  runtime          = var.runtime
  filename         = var.source_path
  source_code_hash = filebase64sha256(var.source_path)

  environment {
    variables = var.environment_variables
  }

  timeout     = 10
  memory_size = 128
}
