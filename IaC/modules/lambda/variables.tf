variable "lambda_name" {
  type        = string
  description = "Nombre de la función Lambda"
}

variable "handler" {
  type        = string
  default     = "index.handler"
  description = "Archivo y función que será el entrypoint"
}

variable "runtime" {
  type    = string
  default = "nodejs22.x"
}

variable "source_path" {
  type        = string
  description = "Ruta al archivo zip del código fuente"
}

variable "environment_variables" {
  type    = map(string)
  default = {}
}
