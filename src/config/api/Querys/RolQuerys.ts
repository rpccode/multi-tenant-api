import { Response } from "express";
import { QueryRunner } from "typeorm";
import { TenantInsertQuery, TenantQuery } from "../../interface/Querys";
import { Person } from "../../entity";

// Función para obtener el nombre del inquilino desde res.locals
const getTenantName = (res: Response): string => {
    return res.locals.tenantName;
};

// Función genérica para construir consultas SELECT
const selectQuery = ({ res, params }: TenantQuery): string => {
    const tenantName = getTenantName(res);
    const { columns, table, filter } = params;
    return `SELECT ${columns} FROM "${tenantName}"."${table}"${filter ? ` WHERE ${filter}` : ''}`;
};

// Función genérica para construir consultas INSERT
const insertQuery = async ({ res, queryRunner, params }: TenantInsertQuery): Promise<void> => {
    const tenantName = getTenantName(res);
    const { table, columns, values } = params;

    const columnsString = columns.join(", ");
    const valuesString = values.map((_, index) => `$${index + 1}`).join(", ");

    const query = `INSERT INTO "${tenantName}"."${table}" (${columnsString}) VALUES (${valuesString})`;

    await queryRunner.query(query, values);
};

// Exportar funciones y consultas utilizando las funciones genéricas
export const getAllRolesQuery = (res: Response): string => {
    return selectQuery({ res, params: { columns: "*", table: "roles" } });
};

export const getRoleByIdQuery = (res: Response, id: number): string => {
    return selectQuery({ res, params: { columns: "*", table: "roles", filter: `id = ${id}` } });
};

export const getAllPermissionsQuery = (res: Response): string => {
    return selectQuery({ res, params: { columns: "*", table: "permissions" } });
};

export const getPermissionByIdQuery = (res: Response, id: number): string => {
    return selectQuery({ res, params: { columns: "*", table: "permissions", filter: `id = ${id}` } });
};

export const getAllUsersQuery = (res: Response): string => {
    return selectQuery({ res, params: { columns: "*", table: "users" } });
};

export const getUserByIdQuery = (res: Response, id: number): string => {
    return selectQuery({ res, params: { columns: "*", table: "users", filter: `id = ${id}` } });
};

export const getAllUserRolesQuery = (res: Response): string => {
    return selectQuery({ res, params: { columns: "*", table: "user_roles" } });
};

export const getUserRoleByIdQuery = (res: Response, id: number): string => {
    return selectQuery({ res, params: { columns: "*", table: "user_roles", filter: `id = ${id}` } });
};

export const getAllUserPermissionsQuery = (res: Response): string => {
    return selectQuery({ res, params: { columns: "*", table: "user_permissions" } });
};

export const getUserPermissionByIdQuery = (res: Response, id: number): string => {
    return selectQuery({ res, params: { columns: "*", table: "user_permissions", filter: `id = ${id}` } });
};

export const getAllRolePermissionsQuery = (res: Response): string => {
    return selectQuery({ res, params: { columns: "*", table: "role_permissions" } });
};

export const getRolePermissionByIdQuery = (res: Response, id: number): string => {
    return selectQuery({ res, params: { columns: "*", table: "role_permissions", filter: `id = ${id}` } });
};

// Ejemplo de uso de la función genérica para inserciones
export const insertRole = async (queryRunner: QueryRunner, res: Response, roleName: string): Promise<void> => {
    await insertQuery({
        res,
        queryRunner,
        params: {
            table: "roles",
            columns: ["name"],
            values: [roleName]
        }
    });
};

export const insertPermission = async (queryRunner: QueryRunner, res: Response, permissionName: string): Promise<void> => {
    await insertQuery({
        res,
        queryRunner,
        params: {
            table: "permissions",
            columns: ["name"],
            values: [permissionName]
        }
    });
};

export const insertUser = async (queryRunner: QueryRunner, res: Response, username: string, password: string): Promise<void> => {}

export const insertPerson = async (queryRunner: QueryRunner, res: Response, person:Person): Promise<void> => {
    // const {first_name, last_name,telefono, typeDni, infoType_id,dni, email,address,state,position  } = person
    await insertQuery({
        res,
        queryRunner,
        params: {
            table: "personas",
            columns: Object.keys(person).filter(key => key!== 'id'),
            values: Object.values(person)
        }
    });
}
