import request from 'supertest';
import express, { Application } from 'express';
import { assignRoleToUser, singIn } from '../modules/auth/controller/authController';
import AuthService from '../modules/auth/services/AuthServices';
import { Role, User } from '../modules/auth/interfaces';
import { AppDataSource } from '../config';


// Mock de AuthService
jest.mock('../services/AuthServices', () => ({
  singIn: jest.fn(),
}));

describe('Auth Controller - signIn', () => {
  let app: Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.post('/signin', singIn);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a token when signIn is successful', async () => {
    const mockSignIn = AuthService.singIn as jest.Mock;
    mockSignIn.mockResolvedValueOnce('fake-token');

    const res = await request(app).post('/signin').send({
      username: 'testuser',
      password: 'password123',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ token: 'fake-token' });
    expect(mockSignIn).toHaveBeenCalledWith('testuser', 'password123', undefined);
  });

  it('should return 500 if an error occurs during signIn', async () => {
    const mockSignIn = AuthService.singIn as jest.Mock;
    mockSignIn.mockRejectedValueOnce(new Error('SignIn Error'));

    const res = await request(app).post('/signin').send({
      username: 'testuser',
      password: 'password123',
    });

    expect(res.statusCode).toBe(500);
    expect(res.text).toContain('Error logging in');
  });
});

jest.mock('../../../config/data-source', () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

describe('User Controller - assignRoleToUser', () => {
  let app: Application;
  let mockUserRepository: any;
  let mockRoleRepository: any;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.post('/assign-role', assignRoleToUser);

    mockUserRepository = {
      findOneBy: jest.fn(),
      save: jest.fn(),
    };
    mockRoleRepository = {
      findOneBy: jest.fn(),
    };
    (AppDataSource.getRepository as jest.Mock).mockImplementation((entity) => {
      if (entity === User) return mockUserRepository;
      if (entity === Role) return mockRoleRepository;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should assign role to user successfully', async () => {
    const mockUser = { id: 1, roles: [] };
    const mockRole = { name: 'admin' };

    mockUserRepository.findOneBy.mockResolvedValueOnce(mockUser);
    mockRoleRepository.findOneBy.mockResolvedValueOnce(mockRole);

    const res = await request(app).post('/assign-role').send({
      userId: 1,
      roleName: 'admin',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'Role assigned successfully' });
    expect(mockUserRepository.save).toHaveBeenCalledWith({ ...mockUser, roles: [mockRole] });
  });

  it('should return 404 if user or role is not found', async () => {
    mockUserRepository.findOneBy.mockResolvedValueOnce(null);

    const res = await request(app).post('/assign-role').send({
      userId: 1,
      roleName: 'admin',
    });

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ message: 'User or Role not found' });
  });

  it('should return 500 if an error occurs', async () => {
    mockUserRepository.findOneBy.mockRejectedValueOnce(new Error('DB Error'));

    const res = await request(app).post('/assign-role').send({
      userId: 1,
      roleName: 'admin',
    });

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ message: 'An error occurred', error: expect.anything() });
  });
});
