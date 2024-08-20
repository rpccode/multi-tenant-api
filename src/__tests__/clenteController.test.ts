import request from 'supertest';
import express, { Application } from 'express';

import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateMultiplePersona, CreatePerson, deletePersona, updatePersona,udateMultiplePersons } from '../modules/loan/controller/PersonController';
import { CreatePersonDto } from '../modules/loan/class/dtos/person/CreatePersonDto';
import { CreateMultiplePerson, createPerson, deletePerson, updatePerson } from '../modules/loan/services/PersonService';
import { UpdatePersonDto } from '../modules/loan/class/dtos/person/UpdatePersonDto';

// Mock de la función de creación de persona
jest.mock('../services/PersonService', () => ({
  createPerson: jest.fn(),
  updatePerson: jest.fn(),
  deletePerson: jest.fn(),
  CreateMultiplePerson: jest.fn(),
  udateMultiplePersons: jest.fn(),
}));

describe('Person Controller - CreatePerson', () => {
  let app: Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.post('/create-person', CreatePerson);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a person successfully', async () => {
    const mockPersonDto = plainToClass(CreatePersonDto, {
      name: 'John Doe',
      email: 'john.doe@example.com',
    });

    (validate as jest.Mock).mockResolvedValueOnce([]);
    (createPerson as jest.Mock).mockResolvedValueOnce('person should be present in the database');

    const res = await request(app).post('/create-person').send({
      name: 'John Doe',
      email: 'john.doe@example.com',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({
      ok: true,
      message: 'Persona creada exitosamente',
      person: mockPersonDto,
    });
  });

  it('should return validation errors', async () => {
    const mockPersonDto = plainToClass(CreatePersonDto, {
      name: '',
      email: 'invalid-email',
    });

    (validate as jest.Mock).mockResolvedValueOnce([{ constraints: { isNotEmpty: 'Name should not be empty' } }]);

    const res = await request(app).post('/create-person').send({
      name: '',
      email: 'invalid-email',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('should return 500 if an error occurs', async () => {
    (validate as jest.Mock).mockResolvedValueOnce([]);
    (createPerson as jest.Mock).mockRejectedValueOnce(new Error('Creation Error'));

    const res = await request(app).post('/create-person').send({
      name: 'John Doe',
      email: 'john.doe@example.com',
    });

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toContain('Hubo un error al crear la persona');
  });
});

describe('Person Controller - updatePersona', () => {
    let app: Application;
  
    beforeAll(() => {
      app = express();
      app.use(express.json());
      app.put('/update-person/:id', updatePersona);
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('should update a person successfully', async () => {
      const mockUpdateDto = plainToClass(UpdatePersonDto, {
        name: 'John Doe Updated',
      });
  
      (validate as jest.Mock).mockResolvedValueOnce([]);
      (updatePerson as jest.Mock).mockResolvedValueOnce('John Doe Updated');
  
      const res = await request(app).put('/update-person/1').send({
        name: 'John Doe Updated',
      });
  
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        ok: true,
        message: 'Persona actualizada exitosamente',
        persona: mockUpdateDto,
      });
    });
  
    it('should return validation errors', async () => {
      const mockUpdateDto = plainToClass(UpdatePersonDto, {
        name: '',
      });
  
      (validate as jest.Mock).mockResolvedValueOnce([{ constraints: { isNotEmpty: 'Name should not be empty' } }]);
  
      const res = await request(app).put('/update-person/1').send({
        name: '',
      });
  
      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toBeDefined();
    });
  
    it('should return 500 if an error occurs', async () => {
      (validate as jest.Mock).mockResolvedValueOnce([]);
      (updatePerson as jest.Mock).mockRejectedValueOnce(new Error('Update Error'));
  
      const res = await request(app).put('/update-person/1').send({
        name: 'John Doe Updated',
      });
  
      expect(res.statusCode).toBe(500);
      expect(res.body.message).toContain('Hubo un error al actualizar la persona');
    });
  });

  describe('Person Controller - deletePersona', () => {
    let app: Application;
  
    beforeAll(() => {
      app = express();
      app.use(express.json());
      app.delete('/delete-person/:id', deletePersona);
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('should delete a person successfully', async () => {
      (deletePerson as jest.Mock).mockResolvedValueOnce(' person is deleted'); 
  
      const res = await request(app).delete('/delete-person/1');
  
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        ok: true,
        message: 'Persona eliminada exitosamente',
      });
    });
  
    it('should return 500 if an error occurs', async () => {
      (deletePerson as jest.Mock).mockRejectedValueOnce(new Error('Delete Error'));
  
      const res = await request(app).delete('/delete-person/1');
  
      expect(res.statusCode).toBe(500);
      expect(res.body.message).toContain('Hubo un error al eliminar la persona');
    });
  });

  describe('Person Controller - CreateMultiplePersona', () => {
    let app: Application;
  
    beforeAll(() => {
      app = express();
      app.use(express.json());
      app.post('/create-multiple-personas', CreateMultiplePersona);
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('should create multiple personas successfully', async () => {
      const personas = [
        { name: 'John Doe', email: 'john.doe@example.com' },
        { name: 'Jane Doe', email: 'jane.doe@example.com' },
      ];
  
      (CreateMultiplePerson as jest.Mock).mockResolvedValueOnce('createMultiplePerson = true');
  
      const res = await request(app).post('/create-multiple-personas').send(personas);
  
      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({
        ok: true,
        message: 'Personas creadas exitosamente',
        personas: personas,
      });
    });
  
    it('should return 500 if an error occurs', async () => {
      (CreateMultiplePerson as jest.Mock).mockRejectedValueOnce(new Error('Creation Error'));
  
      const res = await request(app).post('/create-multiple-personas').send([
        { name: 'John Doe', email: 'john.doe@example.com' },
      ]);
  
      expect(res.statusCode).toBe(500);
      expect(res.body.message).toContain('Hubo un error al crear las personas');
    });
  });
  describe('Person Controller - udateMultiplePersons', () => {
    let app: Application;
  
    beforeAll(() => {
      app = express();
      app.use(express.json());
      app.put('/update-multiple-persons', udateMultiplePersons);
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('should update multiple personas successfully', async () => {
      const personas = [
        { id: 1, name: 'John Doe Updated' },
        { id: 2, name: 'Jane Doe Updated' },
      ];
  
      (updatePerson as jest.Mock).mockResolvedValueOnce('updatePerson should be resolved once the updatePerson');
  
      const res = await request(app).put('/update-multiple-persons').send(personas);
  
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        ok: true,
        message: 'Personas actualizadas exitosamente',
        personas: personas,
      });
    });
  
    it('should return 500 if an error occurs', async () => {
      (updatePerson as jest.Mock).mockRejectedValueOnce(new Error('Update Error'));
  
      const res = await request(app).put('/update-multiple-persons').send([
        { id: 1, name: 'John Doe Updated' },
      ]);
  
      expect(res.statusCode).toBe(500);
      expect(res.body.message).toContain('Hubo un error al actualizar las personas');
    });
  });