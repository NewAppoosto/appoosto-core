import { HttpStatus } from "@nestjs/common";
import { GraphQLError } from "graphql";
import { RpcException } from "@nestjs/microservices";

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
    this.name = "ApiError";

    // @ts-ignore Error.captureStackTrace exists in V8 environments
    if (Error.captureStackTrace) {
      // @ts-ignore Error.captureStackTrace exists in V8 environments
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toGraphQLError(): GraphQLError {
    const error = new GraphQLError(this.message, {
      extensions: {
        code: this.errorType.errorCode,
        status: this.errorType.errorStatus,
        http: {
          status: this.errorType.errorStatus,
        },
      },
    });
    // @ts-ignore - Adding custom property for NestJS/Apollo to read
    error.status = this.errorType.errorStatus;
    return error;
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
}
