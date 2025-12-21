import * as express from "express";
import { User } from "../custom";



declare global {
  namespace Express {
    export interface Request {
      user: User;
    }
  }
}


// to make the file a module and avoid the TypeScript error
export {};