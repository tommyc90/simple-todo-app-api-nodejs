import { FastifyError } from 'fastify';

export class ResourceNotUniqueError extends Error implements FastifyError {
  public readonly code: string = 'RESOURCE_NOT_UNIQUE';
  public readonly name: string = ResourceNotUniqueError.name;
  public readonly statusCode: number = 400;

  constructor(message = 'Resource not unique') {
    super(message);
    Object.setPrototypeOf(this, ResourceNotUniqueError.prototype);
  }
}
