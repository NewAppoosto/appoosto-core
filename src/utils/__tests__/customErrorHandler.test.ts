import { customErrorHandler } from "../customErrorHandler";
import { GraphQLError } from "graphql";
import { HttpStatus } from "@nestjs/common";

describe("customErrorHandler", () => {
  it("should throw a GraphQLError with correct extensions", () => {
    const errorType = {
      errorCode: "ERR004",
      errorStatus: HttpStatus.FORBIDDEN,
    };
    const errorMessage = "Access denied";

    expect(() => customErrorHandler(errorMessage, errorType)).toThrow(
      GraphQLError
    );

    try {
      customErrorHandler(errorMessage, errorType);
    } catch (error: any) {
      expect(error).toBeInstanceOf(GraphQLError);
      expect(error.message).toBe(errorMessage);
      expect(error.extensions.code).toBe(errorType.errorCode);
      expect(error.extensions.http.status).toBe(errorType.errorStatus);
    }
  });
});
