import fastify, {FastifyReply, FastifyRequest } from 'fastify';
import { todoRoutes, TODO_BASE_ROUTE } from './router/todoRouter.js';
import { USER_BASE_ROUTE, userRoutes } from './router/userRouter.js';
import { ResourceNotValidError } from './error/ResourceNotValidError.js';
import fastifyJwt from '@fastify/jwt';

export const buildFastifyApp = () => {
  const app = fastify({ logger: true });
  
  app.register(fastifyJwt, {
    secret: process.env.AUTH_JWT_SECRET || 'authjwtsecret',
  });

  app.decorate('authenticate', async function(request: FastifyRequest, reply: FastifyReply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  app.register(async function (api) {
    api.register(userRoutes, { prefix: USER_BASE_ROUTE });
    api.register(todoRoutes, { prefix: TODO_BASE_ROUTE });
  }, { prefix: '/api' });

  app.setErrorHandler((error, request, reply) => {
    if (error instanceof ResourceNotValidError) {
      return reply.status(error.statusCode).send(error.getResponseData());
    }
    return error;
  });

  return app;
};
