resource "aws_api_gateway_rest_api" "apigateway_app_challenge" {
  name        = var.api_name
  description = "REST API for ${var.api_name}"
  body        = data.template_file.oas.rendered
}

resource "aws_lambda_permission" "api" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda.create_portal_challenge_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api.execution_arn}/*/*"
}

resource "aws_api_gateway_deployment" "deployment_app_challenge" {
  depends_on  = [aws_api_gateway_rest_api.apigateway_app_challenge]
  rest_api_id = aws_api_gateway_rest_api.apigateway_app_challenge.id

  triggers = {
    redeploy_hash = filebase64sha256(data.template_file.oas.rendered)
  }
}

resource "aws_api_gateway_stage" "prod" {
  stage_name    = "prod"
  rest_api_id   = aws_api_gateway_rest_api.apigateway_app_challenge.id
  deployment_id = aws_api_gateway_deployment.deployment_app_challenge.id
  description   = "Stage de producción"
}

data "template_file" "oas" {
  template = file("../${path.root}/welcome-portal-app-mngr/static/oas.json")

  vars = {
    region     = "us-east-1"
    lambda_arn = var.lambda.create_portal_challenge_lambda.arn
  }
}