

import { AppDataSource } from '../config';
import { createTenantAndUser } from '../modules/auth/services/schemaService';
import { deleteUser, updateUserRole } from '../modules/auth/services/UserServices';





beforeAll(async () => {
  await AppDataSource.initialize();
});

afterAll(async () => {
  await AppDataSource.destroy();
});

describe('Schema Service', () => {
  it('should create a new user', async () => {
    await createTenantAndUser( "tenant_test",
      "testuser",
      "test@example.com",
      "password123",
      "admin",1);
    // Agregar lógica para verificar que el usuario fue creado en la base de datos
  });

  it('should update user role', async () => {
    await updateUserRole('tenant1', 'testuser', 'user');
    // Agregar lógica para verificar que el rol del usuario fue actualizado en la base de datos
  });

  it('should delete a user', async () => {
    await deleteUser('tenant1', 'testuser');
    // Agregar lógica para verificar que el usuario fue eliminado de la base de datos
  });
});
