import { describe, expect, it } from 'vitest';
import { UserCreateDto } from '../../src/dto/UserCreateDto.js';
import { UserDto } from '../../src/dto/UserDto.js';
import { getFastifyApp } from '../helpers/setup.js';
import { USER_BASE_ROUTE } from '../../src/router/userRouter.js';
import { UserAuthDto } from '../../src/dto/UserAuthDto.js';
import { Types } from 'mongoose';

const API_USER_BASE_ROUTE = `api${USER_BASE_ROUTE}`;

let user1Dto: UserDto;
let user1Token: string;
const user1CreateDto = new UserCreateDto({ username: 'testuser1', password: 'Abc_123' });
const user1AuthDto = new UserAuthDto({ ...user1CreateDto });

describe('User API (e2e)', () => {
  it(`POST /${API_USER_BASE_ROUTE} should create an user`, async () => {
    const response = await getFastifyApp().inject({
      url: API_USER_BASE_ROUTE,
      method: 'POST',
      payload: user1CreateDto,
    });

    expect(response.statusCode).toBe(201);
    const data = response.json();
    expect(data).toMatchObject({
      username: user1CreateDto.username,
    });
    user1Dto = data;
  });

  it(`POST /${API_USER_BASE_ROUTE} should fail to create an user`, async () => {
    const response = await getFastifyApp().inject({
      url: API_USER_BASE_ROUTE,
      method: 'POST',
      payload: user1CreateDto,
    });

    expect(response.statusCode).toBe(400);
  });

  it(`POST /${API_USER_BASE_ROUTE}/auth should authenticate an user`, async () => {
    const response = await getFastifyApp().inject({
      url: `${API_USER_BASE_ROUTE}/auth`,
      method: 'POST',
      payload: user1AuthDto,
    });

    expect(response.statusCode).toBe(200);
    const data = response.json();
    expect(data).toHaveProperty('token');
    user1Token = data.token;
  });

  it(`GET /${API_USER_BASE_ROUTE}/:id should get autheticated user (self alias)`, async () => {
    const response = await getFastifyApp().inject({
      url: `${API_USER_BASE_ROUTE}/self`,
      method: 'GET',
      headers: {
        authorization: `Bearer ${user1Token}`, 
      },
    });

    expect(response.statusCode).toBe(200);
    const data = response.json();
    expect(data).toMatchObject(user1Dto);
  });

  it(`GET /${API_USER_BASE_ROUTE}/:id should get autheticated user (hex id)`, async () => {
    const response = await getFastifyApp().inject({
      url: `${API_USER_BASE_ROUTE}/${user1Dto.id}`,
      method: 'GET',
      headers: {
        authorization: `Bearer ${user1Token}`, 
      },
    });

    expect(response.statusCode).toBe(200);
    const data = response.json();
    expect(data).toMatchObject(user1Dto);
  });

  it(`POST /${API_USER_BASE_ROUTE}/auth should fail authentication (wrong username)`, async () => {
    const response = await getFastifyApp().inject({
      url: `${API_USER_BASE_ROUTE}/auth`,
      method: 'POST',
      payload: new UserAuthDto({ username: 'wrongusername', password: user1AuthDto.password }),
    });

    expect(response.statusCode).toBe(401);
  });

  it(`POST /${API_USER_BASE_ROUTE}/auth should fail authentication (wrong password)`, async () => {
    const response = await getFastifyApp().inject({
      url: `${API_USER_BASE_ROUTE}/auth`,
      method: 'POST',
      payload: new UserAuthDto({ username: user1AuthDto.username, password: 'wrongpassword' }),
    });

    expect(response.statusCode).toBe(401);
  });

  it(`GET /${API_USER_BASE_ROUTE}/:id should fail getting autheticated user (no token)`, async () => {
    const response = await getFastifyApp().inject({
      url: `${API_USER_BASE_ROUTE}/self`,
      method: 'GET',
    });

    expect(response.statusCode).toBe(401);
  });

  it(`GET /${API_USER_BASE_ROUTE}/:id should fail getting autheticated user (invalid user id in token)`, async () => {
    const invalidToken = await getFastifyApp().jwt.sign({ userId: new Types.ObjectId().toHexString() });
    const response = await getFastifyApp().inject({
      url: `${API_USER_BASE_ROUTE}/self`,
      method: 'GET',
      headers: {
        authorization: `Bearer ${invalidToken}`, 
      },
    });

    expect(response.statusCode).toBe(401);
  });

  it(`GET /${API_USER_BASE_ROUTE}/:id should fail getting autheticated user (invalid token payload)`, async () => {
    const invalidToken = await getFastifyApp().jwt.sign({ invalidPayload: '' });
    const response = await getFastifyApp().inject({
      url: `${API_USER_BASE_ROUTE}/self`,
      method: 'GET',
      headers: {
        authorization: `Bearer ${invalidToken}`, 
      },
    });

    expect(response.statusCode).toBe(401);
  });
});
