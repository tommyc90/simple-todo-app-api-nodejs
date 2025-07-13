import { FastifyReply, FastifyRequest } from 'fastify';
import { User } from '../data/User.js';
import { InvalidCredentialsError } from '../error/InvalidCredentialsError.js';
import { getUserIdFromRequest } from '../controller/controllerUtils.js';
import { isObjectIdOrHexString } from 'mongoose';

export function validateUserExists() {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = getUserIdFromRequest(request);
    if (!isObjectIdOrHexString(userId)) {
      throw new InvalidCredentialsError();
    }
    const exists = await User.exists({ _id: userId });
    if (exists === null) {
      throw new InvalidCredentialsError();
    }
  };
}
