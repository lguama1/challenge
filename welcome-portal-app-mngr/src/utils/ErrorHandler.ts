import { Prisma } from '@prisma/client'
import {  Response } from 'express';

interface ServiceError {
  status: number;
  message: string;
  err: unknown;
}

function isServiceError(error: any): error is ServiceError {
  return (
    error &&
    typeof error === 'object' &&
    typeof error.status === 'number' &&
    typeof error.message === 'string' &&
    'err' in error
  )
}

export function sendHttpError(res: Response, error: unknown) {
  if (!isServiceError(error)) {
    res.status(500).json({
      message: "Internal server error",
      statusCode: 500,
    });

    return
  }

  const { status, message} = error;

  const responseBody: Record<string, unknown> = {
    message,
    statusCode: status,
  };

  res.status(status).json(responseBody);
}

export function HandleServiceError(error: unknown): ServiceError {
   if (isServiceError(error)) {
    return error 
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return handlePrismaError(error)
  }

  return {
    status: 500,
    message: 'Error inesperado.',
    err: error
  }
}

function handlePrismaError(error: Prisma.PrismaClientKnownRequestError): ServiceError {
     switch (error.code) {
      case 'P2002':
        return {
          status: 409,
          message: `El valor del campo único ya existe: ${error.meta?.target}`,
          err: error
        }
      case 'P2025':
        return {
          status: 404,
          message: 'El registro no fue encontrado',
          err: error
        }
      default:
        return {
          status: 500,
          message: 'Error conocido de Prisma no manejado.',
          err: error
        }
    }
}
