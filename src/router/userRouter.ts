import { FastifyInstance } from 'fastify';
import { dtoJsonSchemas } from './jsonSchemas.js';
import { authUser, createUser, getUser } from '../controller/userController.js';
import { UserCreateDto } from '../dto/UserCreateDto.js';
import { UserAuthDto } from '../dto/UserAuthDto.js';
import { validateDto } from '../validation/validateDto.js';
import { validateUniqueUsername } from '../validation/validateUniqueUsername.js';
import { validateUserExists } from '../validation/validateUserExists.js';

export const USER_BASE_ROUTE = '/users';

export const userRoutes = async function routes(fastify: FastifyInstance) {
  fastify.get<{ Params: { id: string } }>('/:id', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            pattern: '^([a-fA-F0-9]{24}|me|self)$',
          },
        },
        required: ['id'],
      },
      response: {
        200: dtoJsonSchemas.UserDto,
      },
    },
    onRequest: [fastify.authenticate],
    preValidation: [validateUserExists()],
  }, getUser);

  fastify.post('', {
    schema: {
      body: dtoJsonSchemas.UserCreateDto,
      response: {
        201: dtoJsonSchemas.UserDto,
      },
    },
    preValidation: [
      validateDto(UserCreateDto),
      validateUniqueUsername(),
    ],
  }, createUser);

  fastify.post('/auth', {
    schema: {
      body: dtoJsonSchemas.UserAuthDto,
      response: {
        200: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
            },
          },
          required: ['token'],
        },
      },
    },
    preValidation: validateDto(UserAuthDto),
  }, authUser);
}
