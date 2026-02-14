import { Express } from "express-serve-static-core";

declare global {
    namespace Express {
        interface Request {
            language?: string;
            user?: any;
        }
    }
}
