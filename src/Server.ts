import { buildFastifyApp } from './App.js';
import { connect } from 'mongoose';

const app = buildFastifyApp();


const start = async () => {
  try {
    await connect(process.env.MONGO_URI || 'mongodb://localhost:27017/todo_app_data');
    await app.listen({ port: parseInt(process.env.APP_PORT || '3000'), host: '0.0.0.0' });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
