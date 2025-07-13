import { FastifyReply, FastifyRequest } from 'fastify';
import { User } from '../data/User.js';
import { ResourceNotUniqueError } from '../error/ResourceNotUniqueError.js';
import { UserCreateDto } from '../dto/UserCreateDto.js';

export function validateUniqueUsername() {
  return async (request: FastifyRequest<{ Body: UserCreateDto }>, reply: FastifyReply) => {
    const { username } = request.body;
    const exists = await User.exists({ username });
    if (exists !== null) {
      throw new ResourceNotUniqueError('Username already taken');
    }
  };
}
