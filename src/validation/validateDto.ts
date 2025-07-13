import { validate } from 'class-validator';
import { ResourceNotValidError } from '../error/ResourceNotValidError.js';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ClassConstructor, plainToInstance } from 'class-transformer';

export function validateDto<T extends object>(dtoClass: ClassConstructor<T>) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const dtoInstance = plainToInstance(dtoClass, request.body);
    const errors = await validate(dtoInstance);
    if (errors.length > 0) {
      throw new ResourceNotValidError('Resource not valid', errors);
    }
  };
}
