import { FastifyInstance } from 'fastify';
import { createTodo, deleteTodo, getTodo, getTodos, updateTodo } from '../controller/todoController.js';
import { dtoJsonSchemas, objectIdJsonSchema } from './jsonSchemas.js';
import { TodoCreateDto } from '../dto/TodoCreateDto.js';
import { TodoUpdateDto } from '../dto/TodoUpdateDto.js';
import { validateDto } from '../validation/validateDto.js';
import { validateUserExists } from '../validation/validateUserExists.js';

export const TODO_BASE_ROUTE = '/todos';

export const todoRoutes = async function routes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', fastify.authenticate);
  fastify.addHook('preValidation', validateUserExists());

  fastify.get('', {
    schema: {
      response: {
        200: {
          type: 'array',
          items: dtoJsonSchemas.TodoDto,
        },
      },
    },
  }, getTodos);

  fastify.get('/:id', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: objectIdJsonSchema,
        },
        required: ['id'],
      },
      response: {
        200: dtoJsonSchemas.TodoDto,
      },
    },
  }, getTodo);

  fastify.post('', {
    schema: {
      body: dtoJsonSchemas.TodoCreateDto,
      response: {
        201: dtoJsonSchemas.TodoDto,
      },
    },
    preValidation: validateDto(TodoCreateDto),
  }, createTodo);

  fastify.post('/:id', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: objectIdJsonSchema,
        },
        required: ['id'],
      },
      body: dtoJsonSchemas.TodoUpdateDto,
      response: {
        200: dtoJsonSchemas.TodoDto,
      },
    },
    preValidation: validateDto(TodoUpdateDto),
  }, updateTodo);

  fastify.delete('/:id', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: objectIdJsonSchema,
        },
        required: ['id'],
      },
      response: {
        204: dtoJsonSchemas.TodoDto,
      },
    },
  }, deleteTodo);
}
