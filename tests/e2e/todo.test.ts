import { describe, expect, it } from 'vitest';
import { TodoCreateDto } from '../../src/dto/TodoCreateDto.js';
import { TodoDto } from '../../src/dto/TodoDto.js';
import { TodoUpdateDto } from '../../src/dto/TodoUpdateDto.js';
import { getFastifyApp } from '../helpers/setup.js';
import { TODO_BASE_ROUTE } from '../../src/router/todoRouter.js';
import { USER_BASE_ROUTE } from '../../src/router/userRouter.js';
import { UserCreateDto } from '../../src/dto/UserCreateDto.js';
import { UserAuthDto } from '../../src/dto/UserAuthDto.js';

const API_USER_BASE_ROUTE = `api${USER_BASE_ROUTE}`;
const API_TODO_BASE_ROUTE = `api${TODO_BASE_ROUTE}`;

let user1Token: string;
let user2Token: string;

let todo1Dto: TodoDto;
const todo1CreateDto = new TodoCreateDto({ title: 'Todo 1' });
const todo1UpdateDto = new TodoUpdateDto({ title: 'Todo 1 update', isDone: true });

describe('Todo API (e2e)', () => {
  // Prepare users first
  it('Should create and authenticate user 1', async () => {
    const user = new UserCreateDto({ username: 'testuser1', password: 'Abc_123' });
    const response = await getFastifyApp().inject({
      url: API_USER_BASE_ROUTE,
      method: 'POST',
      payload: user,
    });
    expect(response.statusCode).toBe(201);
    const tokenResponse = await getFastifyApp().inject({
      url: `${API_USER_BASE_ROUTE}/auth`,
      method: 'POST',
      payload: new UserAuthDto({ username: user.username, password: user.password }),
    });

    expect(tokenResponse.statusCode).toBe(200);
    user1Token = tokenResponse.json().token;
  });

  it('Should create and authenticate user 2', async () => {
    const user = new UserCreateDto({ username: 'testuser2', password: 'Xyz_987' });
    const response = await getFastifyApp().inject({
      url: API_USER_BASE_ROUTE,
      method: 'POST',
      payload: user,
    });
    expect(response.statusCode).toBe(201);
    const tokenResponse = await getFastifyApp().inject({
      url: `${API_USER_BASE_ROUTE}/auth`,
      method: 'POST',
      payload: new UserAuthDto({ username: user.username, password: user.password }),
    });

    expect(tokenResponse.statusCode).toBe(200);
    user2Token = tokenResponse.json().token;
  });

  // Now the actual todos tests
  it(`POST /${API_TODO_BASE_ROUTE} should create a todo (user 1)`, async () => {
    const response = await getFastifyApp().inject({
      url: API_TODO_BASE_ROUTE,
      method: 'POST',
      payload: todo1CreateDto,
      headers: {
        authorization: `Bearer ${user1Token}`,
      },
    });

    expect(response.statusCode).toBe(201);
    const data = response.json();
    expect(data).toMatchObject({
      ...todo1CreateDto,
      isDone: false,
    });
    todo1Dto = data;
  });

  it(`POST /${API_TODO_BASE_ROUTE} should fail to create a todo (user 1)`, async () => {
    const response = await getFastifyApp().inject({
      url: API_TODO_BASE_ROUTE,
      method: 'POST',
      payload: new TodoCreateDto({ title: '' }),
      headers: {
        authorization: `Bearer ${user1Token}`,
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it(`GET /${API_TODO_BASE_ROUTE} should list single todo (user 1)`, async () => {
    const response = await getFastifyApp().inject({
      url: API_TODO_BASE_ROUTE,
      method: 'GET',
      headers: {
        authorization: `Bearer ${user1Token}`,
      },
    });

    expect(response.statusCode).toBe(200);
    const data = response.json();
    expect(Array.isArray(data)).toBe(true);
    expect((data as Array<any>).length).toBe(1);
    expect(data[0]).toMatchObject(todo1Dto);
  });

  it(`GET /${API_TODO_BASE_ROUTE} should list zero todos (user 2)`, async () => {
    const response = await getFastifyApp().inject({
      url: API_TODO_BASE_ROUTE,
      method: 'GET',
      headers: {
        authorization: `Bearer ${user2Token}`,
      },
    });

    expect(response.statusCode).toBe(200);
    const data = response.json();
    expect(Array.isArray(data)).toBe(true);
    expect((data as Array<any>).length).toBe(0);
  });

  it(`GET /${API_TODO_BASE_ROUTE}/:id should get desired todo (user 1)`, async () => {
    const response = await getFastifyApp().inject({
      url: `${API_TODO_BASE_ROUTE}/${todo1Dto.id}`,
      method: 'GET',
      headers: {
        authorization: `Bearer ${user1Token}`,
      },
    });

    expect(response.statusCode).toBe(200);
    const data = response.json();
    expect(data).toMatchObject(todo1Dto);
  });

  it(`GET /${API_TODO_BASE_ROUTE}/:id should fail (auth) to get desired todo (user 2)`, async () => {
    const response = await getFastifyApp().inject({
      url: `${API_TODO_BASE_ROUTE}/${todo1Dto.id}`,
      method: 'GET',
      headers: {
        authorization: `Bearer ${user2Token}`,
      },
    });

    expect(response.statusCode).toBe(403);
  });

  it(`POST /${API_TODO_BASE_ROUTE}/:id should update desired todo (user 1)`, async () => {
    const response = await getFastifyApp().inject({
      url: `${API_TODO_BASE_ROUTE}/${todo1Dto.id}`,
      method: 'POST',
      payload: todo1UpdateDto,
      headers: {
        authorization: `Bearer ${user1Token}`,
      },
    });

    expect(response.statusCode).toBe(200);
    const data = response.json();
    expect(data).toMatchObject({
      id: todo1Dto.id,
      ...todo1UpdateDto,
    });
  });

  it(`POST /${API_TODO_BASE_ROUTE}/:id should fail (auth) to update desired todo (user 2)`, async () => {
    const response = await getFastifyApp().inject({
      url: `${API_TODO_BASE_ROUTE}/${todo1Dto.id}`,
      method: 'POST',
      payload: todo1UpdateDto,
      headers: {
        authorization: `Bearer ${user2Token}`,
      },
    });

    expect(response.statusCode).toBe(403);
  });

  it(`DELETE /${API_TODO_BASE_ROUTE}/:id should fail (auth) to delete desired todo (user 2)`, async () => {
    const response = await getFastifyApp().inject({
      url: `${API_TODO_BASE_ROUTE}/${todo1Dto.id}`,
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${user2Token}`,
      },
    });

    expect(response.statusCode).toBe(403);
  });

  it(`DELETE /${API_TODO_BASE_ROUTE}/:id should delete desired todo (user 1)`, async () => {
    const response = await getFastifyApp().inject({
      url: `${API_TODO_BASE_ROUTE}/${todo1Dto.id}`,
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${user1Token}`,
      },
    });

    expect(response.statusCode).toBe(204);
  });

  it(`GET /${API_TODO_BASE_ROUTE}/:id should fail to get non existent todo (user 1)`, async () => {
    const response = await getFastifyApp().inject({
      url: `${API_TODO_BASE_ROUTE}/${todo1Dto.id}`,
      method: 'GET',
      headers: {
        authorization: `Bearer ${user1Token}`,
      },
    });

    expect(response.statusCode).toBe(404);
  });

  it(`DELETE /${API_TODO_BASE_ROUTE}/:id should fail to delete non existent todo (user 1)`, async () => {
    const response = await getFastifyApp().inject({
      url: `${API_TODO_BASE_ROUTE}/${todo1Dto.id}`,
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${user1Token}`,
      },
    });

    expect(response.statusCode).toBe(404);
  });
});
