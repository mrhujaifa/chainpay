import { type Request, type Response, type NextFunction } from "express";
import { AppError } from "../utils/AppError";
import type { ZodSchema } from "zod/v3";

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const message = result.error.issues.map((e) => e.message).join(", ");
      return next(new AppError(message, 400));
    }

    req.body = result.data;
    next();
  };
};
