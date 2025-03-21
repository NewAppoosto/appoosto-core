import { RpcException } from "@nestjs/microservices";
import { ApiError } from "../utils/apiError";

/**
 * Decorator for controller methods to handle API errors and convert them to RPC errors
 */
export function HandleApiError() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        if (error instanceof ApiError) {
          throw error.toRpcError();
        }
        throw error;
      }
    };

    return descriptor;
  };
}

/**
 * Decorator for consumer methods to handle RPC errors and convert them to GraphQL errors
 */
export function HandleRpcError() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        if (error instanceof RpcException) {
          const rpcError = error.getError() as any;

          // Check if it's our ApiError format
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
            throw apiError.toGraphQLError();
          }
        }
        throw error;
      }
    };

    return descriptor;
  };
}
