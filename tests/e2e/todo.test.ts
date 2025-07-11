import { describe, expect, it } from 'vitest';
import { TodoCreateDto } from '../../src/dto/TodoCreateDto.js';
import { TodoDto } from '../../src/dto/TodoDto.js';
import { TodoUpdateDto } from '../../src/dto/TodoUpdateDto.js';
import { getFastifyApp } from '../helpers/setup.js';
import { TODO_BASE_ROUTE } from '../../src/router/todoRouter.js';

const API_TODO_BASE_ROUTE = `api${TODO_BASE_ROUTE}`;

let todo1Dto: TodoDto;
const todo1CreateDto = new TodoCreateDto({ title: 'Todo 1' });
const todo1UpdateDto = new TodoUpdateDto({ title: 'Todo 1 update', isDone: true });

describe('Todo API (e2e)', () => {
  it('POST /api/todos should create a todo', async () => {
    const response = await getFastifyApp().inject({
      url: API_TODO_BASE_ROUTE,
      method: 'POST',
      payload: todo1CreateDto,
    });

    expect(response.statusCode).toBe(201);
    const data = response.json();
    expect(data).toMatchObject({
      ...todo1CreateDto,
      isDone: false,
    });
    todo1Dto = data;
  });

  it('POST /api/todos should fail to create a todo', async () => {
    const response = await getFastifyApp().inject({
      url: API_TODO_BASE_ROUTE,
      method: 'POST',
      payload: {
        title: '',
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it('GET /api/todos should list single todo', async () => {
    const response = await getFastifyApp().inject({
      url: API_TODO_BASE_ROUTE,
      method: 'GET',
    });

    expect(response.statusCode).toBe(200);
    const data = response.json();
    expect(Array.isArray(data)).toBe(true);
    expect((data as Array<any>).length).toBe(1);
    expect(data[0]).toMatchObject(todo1Dto);
  });

  it('GET /api/todos/:id should get desired todo', async () => {
    const response = await getFastifyApp().inject({
      url: `${API_TODO_BASE_ROUTE}/${todo1Dto.id}`,
      method: 'GET',
    });

    expect(response.statusCode).toBe(200);
    const data = response.json();
    expect(data).toMatchObject(todo1Dto);
  });

  it('POST /api/todos/:id should update desired todo', async () => {
    const response = await getFastifyApp().inject({
      url: `${API_TODO_BASE_ROUTE}/${todo1Dto.id}`,
      method: 'POST',
      payload: todo1UpdateDto,
    });

    expect(response.statusCode).toBe(200);
    const data = response.json();
    expect(data).toMatchObject({
      id: todo1Dto.id,
      ...todo1UpdateDto,
    });
  });

  it('DELETE /api/todos/:id should delete desired todo', async () => {
    const response = await getFastifyApp().inject({
      url: `${API_TODO_BASE_ROUTE}/${todo1Dto.id}`,
      method: 'DELETE',
    });

    expect(response.statusCode).toBe(204);
  });

  it('GET /api/todos/:id should fail to get non existent todo', async () => {
    const response = await getFastifyApp().inject({
      url: `${API_TODO_BASE_ROUTE}/${todo1Dto.id}`,
      method: 'GET',
    });

    expect(response.statusCode).toBe(404);
  });

  it('DELETE /api/todos/:id should fail to delete non existent todo', async () => {
    const response = await getFastifyApp().inject({
      url: `${API_TODO_BASE_ROUTE}/${todo1Dto.id}`,
      method: 'DELETE',
    });

    expect(response.statusCode).toBe(404);
  });
});
