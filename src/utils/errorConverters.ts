import { RpcException } from "@nestjs/microservices";
import { ApiError } from "./apiError";
import { ErrorTypes } from "../constants";

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
 * Decorator that converts RpcException back to ApiError
 * Use this in your consumer service methods where you want to convert RPC errors back to API format
 */
export function ToApiError() {
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
          const rpcError = error.getError() as any;

          // If it's our ApiError format, convert back
          if (
            rpcError &&
            typeof rpcError === "object" &&
            "errorType" in rpcError &&
            "message" in rpcError
          ) {
            const apiError = new ApiError(
              rpcError.message as string,
              rpcError.errorType
            );
            throw apiError;
          }

          // If it's a regular RPC error, wrap in ApiError
          throw new ApiError(
            typeof rpcError === "string" ? rpcError : "Internal Server Error",
            ErrorTypes.INTERNAL_SERVER_ERROR
          );
        }
        // If it's not an RPC error, wrap it in ApiError
        const message =
          error instanceof Error ? error.message : "Internal Server Error";
        throw new ApiError(message, ErrorTypes.INTERNAL_SERVER_ERROR);
      }
    };

    return descriptor;
  };
}
