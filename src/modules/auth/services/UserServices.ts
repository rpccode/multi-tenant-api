import bcrypt from 'bcrypt';
import { AppDataSource } from '../../../config';
import { logAudit } from './schemaService';



export const createUser = async (tenantName: string, username: string, email: string, password: string,roleName: string) => {

  
  
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  
  try {
      const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));
        const roleResult = await queryRunner.query(`SELECT id FROM "${tenantName}".roles WHERE name = $1`, [roleName]);
        let roleId;
    
        if (roleResult.length === 0) {
          const insertRoleResult = await queryRunner.query(`INSERT INTO "${tenantName}".roles (name) VALUES ($1) RETURNING id`, [roleName]);
          roleId = insertRoleResult[0].id;
        } else {
          roleId = roleResult[0].id;
        }
    
        await queryRunner.query(`INSERT INTO "${tenantName}".users (username,email, password, roleId) VALUES ($1, $2, $3,$4)`, [username,email, hashedPassword, roleId]);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  };

  export const deleteUser = async (tenantName: string, username: string) => {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
  
    try {
      await queryRunner.query(`DELETE FROM "${tenantName}".users WHERE username = $1`, [username]);
      await logAudit('delete', 'user', username, `User ${username} deleted`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  };
  
  export const deleteRole = async (tenantName: string, roleName: string) => {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
  
    try {
      await queryRunner.query(`DELETE FROM "${tenantName}".roles WHERE name = $1`, [roleName]);
      await logAudit('delete', 'role', roleName, `Role ${roleName} deleted`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  };
  
  export const getUsers = async (tenantName: string, page: number, limit: number, search: string) => {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
  
    try {
      const offset = (page - 1) * limit;
      const query = `
        SELECT u.username, r.name as role 
        FROM "${tenantName}".users u
        JOIN "${tenantName}".roles r ON u.roleId = r.id
        WHERE u.username ILIKE $1
        LIMIT $2 OFFSET $3
      `;
      const users = await queryRunner.query(query, [`%${search}%`, limit, offset]);
  
      const countQuery = `
        SELECT COUNT(*) 
        FROM "${tenantName}".users u
        WHERE u.username ILIKE $1
      `;
      const total = await queryRunner.query(countQuery, [`%${search}%`]);
  
      return {
        users,
        total: parseInt(total[0].count, 10),
        page,
        limit,
      };
    } catch (error) {
      throw error;
    } finally {
      await queryRunner.release();
    }
  };
  
  export const updateUser = async (tenantName: string, username: string, newUsername: string, newPassword: string) => {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
  
    try {
      let hashedPassword = null;
      if (newPassword) {
        hashedPassword = await bcrypt.hash(newPassword, process.env.SALT_ROUNDS);
      }
  
      if (newUsername && hashedPassword) {
        await queryRunner.query(`UPDATE "${tenantName}".users SET username = $1, password = $2 WHERE username = $3`, [newUsername, hashedPassword, username]);
      } else if (newUsername) {
        await queryRunner.query(`UPDATE "${tenantName}".users SET username = $1 WHERE username = $2`, [newUsername, username]);
      } else if (hashedPassword) {
        await queryRunner.query(`UPDATE "${tenantName}".users SET password = $1 WHERE username = $2`, [hashedPassword, username]);
      }
      await queryRunner.commitTransaction();
      await logAudit('update', 'user', username, `User ${username} updated`);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  };

  export const assignPermissionToRole = async (tenantName: string, roleId: number, permissionName: string) => {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
  
    try {
      if (!tenantName ||!roleId ||!permissionName) {
        throw new Error('Missing required parameters');
      }
      console.log({
        tenantName,
        roleId,
        permissionName,
      })
      const roleResult = await queryRunner.query(`SELECT "id" FROM "${tenantName}".roles r WHERE r."id" = $1`, [roleId]);
      console.log({roleResult})
      if (roleResult.length === 0) {
        throw new Error(`Role ${roleId} not found`);
      }
      const role = roleResult[0].id;
  
      const permissionResult = await queryRunner.query(`SELECT id FROM "${tenantName}".permissions WHERE name = $1`, [permissionName]);
      if (permissionResult.length === 0) {
        const insertPermissionResult = await queryRunner.query(`INSERT INTO "${tenantName}".permissions (name) VALUES ($1) RETURNING id`, [permissionName]);
        const permissionId = insertPermissionResult[0].id;
        await queryRunner.query(`INSERT INTO "${tenantName}".role_permissions (roleId, permissionId) VALUES ($1, $2)`, [role, permissionId]);
      } else {
        const permissionId = permissionResult[0].id;
        await queryRunner.query(`INSERT INTO "${tenantName}".role_permissions (roleId, permissionId) VALUES ($1, $2)`, [role, permissionId]);
      }
  
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  };
  export const updateUserRole = async (tenantName: string, username: string, newRoleName: string) => {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
  
    try {
      const roleResult = await queryRunner.query(`SELECT id FROM "${tenantName}".roles WHERE name = $1`, [newRoleName]);
      let roleId;
  
      if (roleResult.length === 0) {
        const insertRoleResult = await queryRunner.query(`INSERT INTO "${tenantName}".roles (name) VALUES ($1) RETURNING id`, [newRoleName]);
        roleId = insertRoleResult[0].id;
      } else {
        roleId = roleResult[0].id;
      }
  
      await queryRunner.query(`UPDATE "${tenantName}".users SET roleId = $1 WHERE username = $2`, [roleId, username]);
      await logAudit('update', 'user', roleId, `User ${username} role updated to ${newRoleName}`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  };