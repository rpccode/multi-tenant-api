import request from 'supertest';
import express, { Application } from 'express';
;

import { registerUser } from '../modules/auth/controller';
import { createUser } from '../modules/auth/services/UserServices';

// Mock de la función createUser para simular su comportamiento en los tests
jest.mock('../services/UserServices', () => ({
  createUser: jest.fn(),
}));

describe('User Controller - registerUser', () => {
  let app: Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.post('/register', registerUser);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should register a user successfully', async () => {
    const mockCreateUser = createUser as jest.Mock;

    mockCreateUser.mockResolvedValueOnce(undefined);

    const res = await request(app).post('/register').send({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      tenant: 'tenant1',
      role: 'user',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({
      ok: true,
      message: 'User created successfully',
    });
    expect(mockCreateUser).toHaveBeenCalledWith('tenant1', 'testuser', 'test@example.com', 'password123', 'user');
  });

  it('should return 500 if there is an error', async () => {
    const mockCreateUser = createUser as jest.Mock;

    mockCreateUser.mockRejectedValueOnce(new Error('Test Error'));

    const res = await request(app).post('/register').send({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      tenant: 'tenant1',
      role: 'user',
    });

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({
      ok: false,
      message: 'Error creating user',
      error: expect.anything(),
    });
  });
});
