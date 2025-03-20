import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { ApiError } from "./apiError";

@Catch(RpcException)
export class RpcExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const error = exception.getError();

    // If it's our ApiError format
    if (
      error &&
      typeof error === "object" &&
      "errorType" in error &&
      "message" in error
    ) {
      const apiError = new ApiError(
        error.message as string,
        error.errorType as any
      );
      throw apiError.toGraphQLError();
    }

    // For other errors, rethrow as is
    throw exception;
  }
}
