import { FastifyReply, FastifyRequest } from 'fastify';
import { assertResourceFound, assertResourceOwned, getUserIdFromRequest } from './controllerUtils.js';
import { TodoCreateDto } from '../dto/TodoCreateDto.js';
import { todoCrud } from '../service/TodoCrud.js';
import { TodoUpdateDto } from '../dto/TodoUpdateDto.js';

export async function getTodos(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  reply.send(await todoCrud.findAll(getUserIdFromRequest(request)));
}

export async function getTodo(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const todo = assertResourceFound(await todoCrud.findOneById(request.params.id));
  assertResourceOwned(todo.userId, getUserIdFromRequest(request));
  reply.send(todo);
}

export async function createTodo(
  request: FastifyRequest<{ Body: TodoCreateDto }>,
  reply: FastifyReply,
) {
  const todo = await todoCrud.create(request.body, getUserIdFromRequest(request));
  reply.status(201).send(todo);
}

export async function updateTodo(
  request: FastifyRequest<{ Params: { id: string }, Body: TodoUpdateDto }>,
  reply: FastifyReply,
) {
  const todo = assertResourceFound(await todoCrud.findOneById(request.params.id));
  assertResourceOwned(todo.userId, getUserIdFromRequest(request));
  const updatedTodo = assertResourceFound(await todoCrud.update(request.params.id, request.body));
  reply.send(updatedTodo);
}

export async function deleteTodo(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const todo = assertResourceFound(await todoCrud.findOneById(request.params.id));
  assertResourceOwned(todo.userId, getUserIdFromRequest(request));
  assertResourceFound(await todoCrud.delete(request.params.id));
  reply.status(204).send();
}
