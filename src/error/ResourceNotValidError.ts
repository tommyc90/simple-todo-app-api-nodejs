import { ValidationError } from 'class-validator';
import { FastifyError } from 'fastify';

export class ResourceNotValidError extends Error implements FastifyError {
  public readonly code: string = 'RESOURCE_NOT_VALID';
  public readonly error: string = 'Bad Request';
  public readonly name: string = ResourceNotValidError.name;
  public readonly statusCode: number = 400;

  constructor(message = 'Resource not valid', public readonly validationErrors: Array<ValidationError> = []) {
    super(message);
    Object.setPrototypeOf(this, ResourceNotValidError.prototype);
  }

  public getResponseData() {
    return {
      statusCode: this.statusCode,
      code: this.code,
      error: this.error,
      message: this.message,
      validationErrors: this.validationErrors,
    };
  }
}
