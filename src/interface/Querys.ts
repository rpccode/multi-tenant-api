import { Response } from "express";
import { QueryRunner } from "typeorm";

interface SelectQueryParams {
    columns: string;
    table: string;
    filter?: string;
}

interface QueryByIdParams {
    table: string;
    id: number;
}

interface TenantQuery {
    res: Response;
    params: SelectQueryParams;
}

interface UserQuery {
    res: Response;
    params: SelectQueryParams;
    userId: number;

}

interface UserWithPermissionsQuery {
    res: Response;
    params: SelectQueryParams;
    userId: number;
    userRole: string;
    tenant: string;
    permissions: string[];
    roles: string[];s
}

interface InsertQueryParams {
    table: string;
    columns: string[];
    values: any[];
}

interface TenantInsertQuery {
    res: Response;
    queryRunner: QueryRunner;
    params: InsertQueryParams;
}



export {
    SelectQueryParams,
    QueryByIdParams,
    TenantQuery,
    InsertQueryParams,
    TenantInsertQuery
}