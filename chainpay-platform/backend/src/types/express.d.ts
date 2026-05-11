import { Role } from "@prisma/client";
import { DecodedIdToken } from "firebase-admin/auth";

declare global {
  namespace Express {
    interface Request {
      user?: DecodedIdToken;
      dbUser?: {
        id: string;
        email: string;
        role: Role;
        isActive: boolean;
        firebaseUid: string;
      };
    }
  }
}
