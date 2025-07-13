import { FastifyError } from 'fastify';

export class InvalidCredentialsError extends Error implements FastifyError {
  public readonly code: string = 'INVALID_CREDENTIALS';
  public readonly name: string = InvalidCredentialsError.name;
  public readonly statusCode: number = 401;

  constructor(message = 'Invalid credentials') {
    super(message);
    Object.setPrototypeOf(this, InvalidCredentialsError.prototype);
  }
}
