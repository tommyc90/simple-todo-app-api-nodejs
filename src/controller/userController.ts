import { FastifyReply, FastifyRequest } from 'fastify';
import { assertResourceFound, assertResourceOwned } from './controllerUtils.js';
import { UserCreateDto } from '../dto/UserCreateDto.js';
import { userCrud } from '../service/UserCrud.js';
import { UserAuthDto } from '../dto/UserAuthDto.js';
import { userAuth } from '../service/UserAuth.js';
import { InvalidCredentialsError } from '../error/InvalidCredentialsError.js';

export interface JWTPayload {
  userId: string;
  username: string;
}

export async function getUser(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const jwtUser = request.user as JWTPayload;
  const userId = ['me', 'self'].includes(request.params.id)
    ? jwtUser.userId
    : request.params.id;
  const user = assertResourceFound(await userCrud.findOneById(userId));
  assertResourceOwned(user.id, jwtUser.userId);
  reply.send(user);
}

export async function createUser(
  request: FastifyRequest<{ Body: UserCreateDto }>,
  reply: FastifyReply,
) {
  const user = await userCrud.create(request.body);
  reply.status(201).send(user);
}

export async function authUser(
  request: FastifyRequest<{ Body: UserAuthDto }>,
  reply: FastifyReply,
) {
  const user = await userAuth.authenticate(request.body);
  if (user === null) {
    throw new InvalidCredentialsError();
  }
  const token = await reply.jwtSign({ userId: user.id, username: user.username })
  reply.send({ token });
}
