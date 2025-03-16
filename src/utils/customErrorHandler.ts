import { GraphQLError } from "graphql";
import { HttpStatus } from "@nestjs/common";

/**
 * Throws a standardized GraphQL error with proper HTTP status code
 * @param errorMessage The error message to display
 * @param errorType The error type containing error code and HTTP status
 */
export const customErrorHandler = (
  errorMessage: string,
  errorType: { errorCode: string; errorStatus: HttpStatus }
): never => {
  throw new GraphQLError(errorMessage, {
    extensions: {
      code: errorType.errorCode,
      http: {
        status: errorType.errorStatus,
      },
    },
  });
};
