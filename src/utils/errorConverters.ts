import { RpcException } from "@nestjs/microservices";
import { ApiError } from "./apiError";
import { ErrorTypes } from "../constants";
import { HttpStatus } from "@nestjs/common";
import { GraphQLError } from "graphql";

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
        console.log("Original error:", error);

        // Handle GraphQLError
        if (error instanceof GraphQLError) {
          console.log("Converting GraphQLError to RPC:", error);
          const apiError = ApiError.fromGraphQLError(error);
          console.log("Created ApiError from GraphQLError:", {
            message: apiError.message,
            errorType: apiError.errorType,
          });
          return apiError.toRpcError();
        }

        // Handle ApiError
        if (error instanceof ApiError) {
          console.log("Converting ApiError to RPC:", {
            message: error.message,
            errorType: error.errorType,
          });
          const rpcError = error.toRpcError();
          console.log("Converted RPC error:", rpcError.getError());
          throw rpcError;
        }

        // Handle other errors
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
 * Decorator that converts RpcException or error object to GraphQLError
 * Use this in your consumer service methods where you want to convert errors to GraphQL format
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
        console.log("ToGraphQLError - Received error:", error);

        // First check if it's a plain error object with our format
        if (
          error &&
          typeof error === "object" &&
          "message" in error &&
          "errorType" in error &&
          typeof error.message === "string" &&
          error.errorType &&
          typeof error.errorType === "object" &&
          "errorCode" in error.errorType &&
          "errorStatus" in error.errorType
        ) {
          console.log("ToGraphQLError - Converting plain error object:", error);
          const apiError = new ApiError(
            error.message as string,
            error.errorType as { errorCode: string; errorStatus: HttpStatus }
          );
          throw apiError.toGraphQLError();
        }

        // Then check if it's an RpcException
        if (error instanceof RpcException) {
          console.log("ToGraphQLError - Handling RpcException");
          const rpcError = error.getError();
          console.log("ToGraphQLError - RPC error details:", rpcError);

          if (isRpcErrorType(rpcError)) {
            console.log(
              "ToGraphQLError - Converting RPC error to GraphQL:",
              rpcError
            );
            const apiError = new ApiError(rpcError.message, rpcError.errorType);
            throw apiError.toGraphQLError();
          }

          // If it's a regular RPC error
          console.log(
            "ToGraphQLError - Converting regular RPC error to GraphQL"
          );
          const message =
            typeof rpcError === "string" ? rpcError : "Internal Server Error";
          const apiError = new ApiError(
            message,
            ErrorTypes.INTERNAL_SERVER_ERROR
          );
          throw apiError.toGraphQLError();
        }

        console.log("ToGraphQLError - Converting unknown error to GraphQL");
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
  const result =
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
    typeof error.errorType.errorStatus === "number";
  return result;
}
