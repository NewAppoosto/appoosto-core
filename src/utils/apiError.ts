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

  static fromGraphQLError(error: GraphQLError): ApiError {
    return new ApiError(error.message, {
      errorCode: (error.extensions?.code as string) || "INTERNAL_SERVER_ERROR",
      errorStatus:
        (error.extensions?.status as HttpStatus) ||
        HttpStatus.INTERNAL_SERVER_ERROR,
    });
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
    console.log("ApiError.toRpcError - Original error:", {
      message: this.message,
      errorType: this.errorType,
    });
    const errorObject = {
      message: this.message,
      errorType: this.errorType,
    };
    console.log("ApiError.toRpcError - Created error object:", errorObject);
    const rpcError = new RpcException(errorObject);
    console.log("ApiError.toRpcError - Final RPC error:", rpcError.getError());
    return rpcError;
  }
}
