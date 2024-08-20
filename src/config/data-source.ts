import "reflect-metadata";
import { DataSource } from "typeorm";

import dotenv from "dotenv";
import {       
  AuditLog,
  Frequency,
  AppConfiguration,
  GeneralConfiguration,
  LoanConfiguration,
  LoanDetail,
  LoanHeader,
  LoanState,
  Payment,
} from "../entity";
import { User, Tenant, Role, Permission, Person } from "../modules/auth/interfaces";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: [
    User,
    Tenant,
    Role,
    Permission,
    AuditLog,
    Frequency,
    AppConfiguration,
    GeneralConfiguration,
    LoanConfiguration,
    LoanDetail,
    LoanHeader,
    LoanState,
    Payment,
    Permission,
    Person,
    Role,
  ],
  synchronize: true,
  logging: false,
});

// 1746461414¡++*'-+
