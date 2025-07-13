import { FastifyError } from 'fastify';

export class ResourceNotOwnedError extends Error implements FastifyError {
  public readonly code: string = 'RESOURCE_NOT_OWNED';
  public readonly name: string = ResourceNotOwnedError.name;
  public readonly statusCode: number = 403;

  constructor(message = 'Resource not owned by user') {
    super(message);
    Object.setPrototypeOf(this, ResourceNotOwnedError.prototype);
  }
}
