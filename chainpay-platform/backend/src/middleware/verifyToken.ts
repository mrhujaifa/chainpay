import type { NextFunction, Request, Response } from "express";

import { AppError } from "../utils/AppError";
import status from "http-status";
import { prisma } from "../../lib/prisma";
import type { Role } from "../../prisma/generated/enums";
import { FirebaseAdmin } from "../../lib/firebaseAdmin";

export const verifyAuth = (...roles: Role[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith(`Bearear `)) {
        throw new AppError(
          "Unauthorized: No token provided",
          status.UNAUTHORIZED,
        );
      }

      // only token split
      const token = authHeader.split(" ")[1];

      // token check
      if (!token) {
        throw new AppError(
          "Unauthorized: Token is missing",
          status.UNAUTHORIZED,
        );
      }

      // Firebase verify
      const decodedToken = await FirebaseAdmin.auth().verifyIdToken(
        token,
        true,
      );
      req.user = decodedToken;

      const dbUser = await prisma.user.findUnique({
        where: {
          firebaseUid: decodedToken.uid,
        },

        select: {
          id: true,
          email: true,
          role: true,
          isActive: true,
          firebaseUid: true,
        },
      });

      if (!dbUser) {
        throw new AppError("User not found", status.NOT_FOUND);
      }

      req.dbUser = dbUser;

      if (roles.length > 0 && !roles.includes(dbUser.role)) {
        throw new AppError(
          `Access denied: Required role is ${roles.join(" or ")}`,
          403,
        );
      }

      next();
    } catch (error) {
      if (error instanceof AppError) {
        return next(error);
      }
      return next(new AppError("Unauthorized: Invalid token", 401));
    }
  };
};
