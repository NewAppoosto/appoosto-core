import { HttpStatus } from "@nestjs/common";
import { GraphQLError } from "graphql";
import { RpcException } from "@nestjs/microservices";

/**
 * Custom API Error class for standardized error handling across microservices
 */
export class ApiError extends GraphQLError {
  errorType: { errorCode: string; errorStatus: HttpStatus };

  constructor(
    message = "Something went wrong",
    errorType: {
      errorCode: string;
      errorStatus: HttpStatus;
    }
  ) {
    super(message, {
      extensions: {
        code: errorType.errorCode,
        status: errorType.errorStatus,
        http: {
          status: errorType.errorStatus,
        },
      },
    });

    this.errorType = errorType;
    this.name = "ApiError";

    // @ts-ignore Error.captureStackTrace exists in V8 environments
    if (Error.captureStackTrace) {
      // @ts-ignore Error.captureStackTrace exists in V8 environments
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Converts ApiError to RpcException while preserving error details
   */
  toRpcError(): RpcException {
    const errorObject = {
      message: this.message,
      errorType: this.errorType,
    };
    return new RpcException(errorObject);
  }

  // No need for toGraphQLError anymore since we are already a GraphQLError
  toGraphQLError(): GraphQLError {
    return this;
  }
}
