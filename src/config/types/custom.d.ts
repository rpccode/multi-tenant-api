// src/types/custom.d.ts
import { User } from '../entities/User';
import * as express from "express"
declare global {
  namespace Express {
    interface Request {
      user?: Record<string,any>
    }
  }
}
