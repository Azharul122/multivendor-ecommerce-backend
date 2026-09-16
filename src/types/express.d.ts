
import { Role } from "../genereted/prisma/enums";

declare global {
  namespace Express {
    interface Request {
      user?: {
        name: string;
        userId: string;
        role: Role;
        email: string;
      };
    }
  }
}

export { };