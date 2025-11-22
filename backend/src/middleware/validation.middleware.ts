import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

/**
 * Validation middleware factory using Zod schemas
 * @param schema - Zod schema to validate against
 * @param source - Part of request to validate ('body', 'query', 'params')
 */
export const validate = (schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const dataToValidate = req[source];
      const validated = schema.parse(dataToValidate);

      // Replace request data with validated (and potentially transformed) data
      req[source] = validated;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        }));

        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors,
        });
        return;
      }

      res.status(400).json({
        success: false,
        message: 'Invalid request data',
      });
    }
  };
};

/**
 * Validate multiple parts of request
 */
export const validateMultiple = (schemas: {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }
      if (schemas.query) {
        req.query = schemas.query.parse(req.query);
      }
      if (schemas.params) {
        req.params = schemas.params.parse(req.params);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        }));

        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors,
        });
        return;
      }

      res.status(400).json({
        success: false,
        message: 'Invalid request data',
      });
    }
  };
};

/**
 * Alias for validateMultiple - commonly used name
 */
export const validateRequest = validateMultiple;
