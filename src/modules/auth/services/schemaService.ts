import bcrypt from "bcrypt";
import { AppDataSource } from "../../../config/data-source";
import { tables, tablesByPublicSchema } from "../../../config/api/tables/tables";
import { tableData } from "../../../config/api/Data/tableData";
import { AuditLog } from "../../../entity";
import { createAdminTenan } from "../../Admin/services/adminServices";



export const createTenantAndUser = async (
  tenantName: string,
  username: string,
  email:string,
  password: string,
  roleName: string,
  planId: number

) => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
   await createTenantSchema(queryRunner, tenantName);
    await insertData(queryRunner, tenantName);
    const roleId = await getOrCreateRole(queryRunner, tenantName, roleName);
    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALT_ROUNDS) || 10
    );

   const id = await queryRunner.query(
      `INSERT INTO "${tenantName}".users (username, email, password, roleId) VALUES ($1, $2, $3,$4) RETURNING id`,
      [username,email, hashedPassword, roleId]
    );
   
    await createAdminTenan(tenantName, id[0].id, planId )

    await queryRunner.commitTransaction();
    await logAudit(
      "create",
      "user",
      roleId,
      `User ${username} created with role ${roleName}`
    );
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
};

const createTenantSchema = async (queryRunner, tenantName) => {
  try {
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "${tenantName}"`);

    // Create tables
    const allTables = tables(tenantName);
    for (const table of allTables) {
      await queryRunner.query(table);
    }

    console.log("Schema  created successfully");
  } catch (error) {
    console.error("Error creating schema :", error);
    throw error; // Re-throw to handle it at a higher level if needed
  }
};

export  const createAdminSchema = async () => {
  const queryRunner = AppDataSource.createQueryRunner();
await queryRunner.connect();
await queryRunner.startTransaction();
  try {
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS admin`);

    const allTables = tablesByPublicSchema();
    for (const table of allTables) {
      await queryRunner.query(table);
    }
    
    console.log("Tables  created successfully");
    await queryRunner.commitTransaction();
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
}

export const insertData = async (queryRunner, tenantName) => {
  // Insert data
  try {
    const insertData = tableData(tenantName);
    for (const data of insertData) {
      await queryRunner.query(data);
    }
    console.log("Data inserted successfully");
  } catch (error) {
    console.error("Error inserting data :", error);
    throw error; // Re-throw to handle it at a higher level if needed
  }
};

export const getOrCreateRole = async (queryRunner, tenantName, roleName) => {
  const roleResult = await queryRunner.query(
    `SELECT id FROM "${tenantName}".roles WHERE name = $1`,
    [roleName]
  );

  if (roleResult.length === 0) {
    const insertRoleResult = await queryRunner.query(
      `INSERT INTO "${tenantName}".roles (name) VALUES ($1) RETURNING id`,
      [roleName]
    );
    return insertRoleResult[0].id;
  }

  return roleResult[0].id;
};

export const assignPermissionToRole = async (
  tenantName: string,
  roleName: string,
  permissionName: string
) => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const roleId = await getRoleId(queryRunner, tenantName, roleName);
    const permissionId = await getOrCreatePermission(
      queryRunner,
      tenantName,
      permissionName
    );

    await queryRunner.query(
      `INSERT INTO "${tenantName}".role_permissions (roleId, permissionId) VALUES ($1, $2)`,
      [roleId, permissionId]
    );

    await queryRunner.commitTransaction();
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
};

const getRoleId = async (queryRunner, tenantName, roleName) => {
  const roleResult = await queryRunner.query(
    `SELECT id FROM "${tenantName}".roles WHERE name = $1`,
    [roleName]
  );

  if (roleResult.length === 0) {
    throw new Error(`Role ${roleName} not found`);
  }

  return roleResult[0].id;
};

const getOrCreatePermission = async (
  queryRunner,
  tenantName,
  permissionName
) => {
  const permissionResult = await queryRunner.query(
    `SELECT id FROM "${tenantName}".permissions WHERE name = $1`,
    [permissionName]
  );

  if (permissionResult.length === 0) {
    const insertPermissionResult = await queryRunner.query(
      `INSERT INTO "${tenantName}".permissions (name) VALUES ($1) RETURNING id`,
      [permissionName]
    );
    return insertPermissionResult[0].id;
  }

  return permissionResult[0].id;
};

export const logAudit = async (action, entity, entityId, description) => {
  const auditLog = new AuditLog();
  auditLog.action = action;
  auditLog.entity = entity;
  auditLog.entityId = entityId;
  auditLog.details = description;
  await AppDataSource.manager.save(auditLog);
};

export const ValidateTenant = async (Tenant: string) => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    const tenantResult = await queryRunner.query(
      `SELECT 
        nspname AS schema_name
        FROM 
            pg_namespace
        WHERE 
            nspname NOT IN ('pg_catalog', 'information_schema') and nspname= $1 LIMIT 1
 `,
      [Tenant]
    );

    if (tenantResult.length === 0) {
      throw new Error(`Tenant ${Tenant} not found`);
    }

    return tenantResult;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
};
