import { FastifyError } from 'fastify';

export class ResourceNotFoundError extends Error implements FastifyError {
  public readonly code: string = 'RESOURCE_NOT_FOUND';
  public readonly name: string = ResourceNotFoundError.name;
  public readonly statusCode: number = 404;

  constructor(message = 'Resource not found') {
    super(message);
    Object.setPrototypeOf(this, ResourceNotFoundError.prototype);
  }
}
