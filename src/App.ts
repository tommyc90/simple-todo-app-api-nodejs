import fastify from 'fastify';
import { todoRoutes, TODO_BASE_ROUTE } from './router/todoRouter.js';

export const buildFastifyApp = () => {
  const app = fastify();
  
  app.register(async function (api) {
    api.register(todoRoutes, { prefix: TODO_BASE_ROUTE });
  }, { prefix: '/api' });

  return app;
};
