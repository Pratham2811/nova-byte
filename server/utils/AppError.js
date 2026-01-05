// utils/AppError.js
export class AppError extends Error {
  constructor(message, statusCode,error) {
    super(message);
    this.statusCode = statusCode;
    this.error=error
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
