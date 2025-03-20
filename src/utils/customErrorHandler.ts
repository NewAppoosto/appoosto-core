import { HttpStatus } from "@nestjs/common";
import { ApiError } from "./apiError";

/**
 * Throws a standardized error using ApiError
 * @param errorMessage The error message to display
 * @param errorType The error type containing error code and HTTP status
 */
export const customErrorHandler = (
  errorMessage: string,
  errorType: { errorCode: string; errorStatus: HttpStatus }
): never => {
  const error = new ApiError(errorMessage, errorType);
  throw error.toGraphQLError();
};
