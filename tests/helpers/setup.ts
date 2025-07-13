import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, connection } from 'mongoose';
import { beforeAll, afterAll } from 'vitest';
import { buildFastifyApp } from '../../src/App.js';

let fastifyApp: Awaited<ReturnType<typeof buildFastifyApp>>;
let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  console.log('beforeAll');
  mongoServer = await MongoMemoryServer.create();
  await connect(mongoServer.getUri());
  fastifyApp = buildFastifyApp();
  await fastifyApp.ready();
});

afterAll(async () => {
  console.log('afterAll');
  await connection.dropDatabase();
  await connection.close();
  await mongoServer.stop();
  await fastifyApp.close();
});

export const getFastifyApp = () => fastifyApp;
