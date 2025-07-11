import { FastifyInstance } from 'fastify';
import { createTodo, deleteTodo, getTodo, getTodos, updateTodo } from '../controller/todoController.js';
import { dtoJsonSchemas, objectIdJsonSchema } from './jsonSchemas.js';

export const TODO_BASE_ROUTE = '/todos';

export const todoRoutes = async function routes(fastify: FastifyInstance) {
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
