import { HttpStatus } from "@nestjs/common";

/**
 * Custom API Error class for standardized error handling across microservices
 */
export class ApiError extends Error {
  errorType: { errorCode: string; errorStatus: HttpStatus };

  constructor(
    message = "Something went wrong",
    errorType: {
      errorCode: string;
      errorStatus: HttpStatus;
    }
  ) {
    super(message);
    this.errorType = errorType;
    // @ts-ignore Error.captureStackTrace exists in V8 environments
    if (Error.captureStackTrace) {
      // @ts-ignore Error.captureStackTrace exists in V8 environments
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
