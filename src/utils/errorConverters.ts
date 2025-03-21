import { RpcException } from "@nestjs/microservices";
import { ApiError } from "./apiError";
import { ErrorTypes } from "../constants";
import { HttpStatus } from "@nestjs/common";

interface RpcErrorType {
  message: string;
  errorType: {
    errorCode: string;
    errorStatus: HttpStatus;
  };
}

/**
 * Decorator that converts ApiError to RpcException
 * Use this in your controller methods where you want to convert ApiErrors to RPC format
 */
export function ToRpcError() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error: unknown) {
        if (error instanceof ApiError) {
          throw error.toRpcError();
        }
        // If it's not an ApiError, wrap it in one
        const message =
          error instanceof Error ? error.message : "Internal Server Error";
        const apiError = new ApiError(
          message,
          ErrorTypes.INTERNAL_SERVER_ERROR
        );
        throw apiError.toRpcError();
      }
    };

    return descriptor;
  };
}

/**
 * Decorator that converts RpcException to GraphQLError
 * Use this in your consumer service methods where you want to convert RPC errors to GraphQL format
 */
export function ToGraphQLError() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error: unknown) {
        if (error instanceof RpcException) {
          const rpcError = error.getError();

          // Check if it's our ApiError format
          if (isRpcErrorType(rpcError)) {
            // Reconstruct ApiError and convert to GraphQLError
            const apiError = new ApiError(rpcError.message, rpcError.errorType);
            throw apiError.toGraphQLError();
          }

          // If it's a regular RPC error
          const message =
            typeof rpcError === "string" ? rpcError : "Internal Server Error";
          const apiError = new ApiError(
            message,
            ErrorTypes.INTERNAL_SERVER_ERROR
          );
          throw apiError.toGraphQLError();
        }

        // If it's not an RPC error
        const message =
          error instanceof Error ? error.message : "Internal Server Error";
        const apiError = new ApiError(
          message,
          ErrorTypes.INTERNAL_SERVER_ERROR
        );
        throw apiError.toGraphQLError();
      }
    };

    return descriptor;
  };
}

function isRpcErrorType(error: unknown): error is RpcErrorType {
  return (
    error !== null &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string" &&
    "errorType" in error &&
    error.errorType !== null &&
    typeof error.errorType === "object" &&
    "errorCode" in error.errorType &&
    typeof error.errorType.errorCode === "string" &&
    "errorStatus" in error.errorType &&
    typeof error.errorType.errorStatus === "number"
  );
}
