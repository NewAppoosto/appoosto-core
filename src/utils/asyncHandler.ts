import { ErrorTypes } from "../constants/errorTypes";
import { ApiError } from "./apiError";
import { customErrorHandler } from "./customErrorHandler";

/**
 * Wraps an async function with standardized error handling
 * @param fn The async function to wrap
 * @returns A wrapped function that handles errors consistently
 */
export const asyncHandler =
  <T extends (...args: any[]) => Promise<any>>(fn: T) =>
  async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      if (error instanceof ApiError) {
        customErrorHandler(error.message, error.errorType);
      }

      // Default error if not an ApiError
      customErrorHandler(
        "Something Went Wrong!",
        ErrorTypes.INTERNAL_SERVER_ERROR
      );
    }
  };
