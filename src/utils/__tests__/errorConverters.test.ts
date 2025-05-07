import { RpcException } from "@nestjs/microservices";
import { GraphQLError } from "graphql";
import { HttpStatus } from "@nestjs/common";
import { ToRpcError, ToGraphQLError, isRpcErrorType } from "../errorConverters";
import { ApiError } from "../apiError";
import { ErrorTypes } from "../../constants";

describe("errorConverters", () => {
  describe("ToRpcError decorator", () => {
    class TestClass {
      @ToRpcError()
      async testMethod() {
        throw new Error("Test error");
      }

      @ToRpcError()
      async testMethodWithApiError() {
        throw new ApiError("API Error", ErrorTypes.BAD_REQUEST);
      }

      @ToRpcError()
      async testMethodWithGraphQLError() {
        throw new GraphQLError("GraphQL Error");
      }

      @ToRpcError()
      async testMethodSuccess() {
        return "success";
      }
    }

    let testInstance: TestClass;

    beforeEach(() => {
      testInstance = new TestClass();
    });

    it("should convert regular Error to RpcException", async () => {
      await expect(testInstance.testMethod()).rejects.toThrow(RpcException);
    });

    it("should convert ApiError to RpcException", async () => {
      await expect(testInstance.testMethodWithApiError()).rejects.toThrow(
        RpcException
      );
    });

    it("should convert GraphQLError to RpcException", async () => {
      await expect(testInstance.testMethodWithGraphQLError()).rejects.toThrow(
        RpcException
      );
    });

    it("should not modify successful responses", async () => {
      const result = await testInstance.testMethodSuccess();
      expect(result).toBe("success");
    });
  });

  describe("ToGraphQLError decorator", () => {
    class TestClass {
      @ToGraphQLError()
      async testMethod() {
        throw new Error("Test error");
      }

      @ToGraphQLError()
      async testMethodWithRpcException() {
        throw new RpcException({
          message: "RPC Error",
          errorType: {
            errorCode: ErrorTypes.BAD_REQUEST,
            errorStatus: HttpStatus.BAD_REQUEST,
          },
        });
      }

      @ToGraphQLError()
      async testMethodWithPlainError() {
        throw {
          message: "Plain Error",
          errorType: {
            errorCode: ErrorTypes.BAD_REQUEST,
            errorStatus: HttpStatus.BAD_REQUEST,
          },
        };
      }

      @ToGraphQLError()
      async testMethodSuccess() {
        return "success";
      }
    }

    let testInstance: TestClass;

    beforeEach(() => {
      testInstance = new TestClass();
    });

    it("should convert regular Error to GraphQLError", async () => {
      await expect(testInstance.testMethod()).rejects.toThrow(GraphQLError);
    });

    it("should convert RpcException to GraphQLError", async () => {
      await expect(testInstance.testMethodWithRpcException()).rejects.toThrow(
        GraphQLError
      );
    });

    it("should convert plain error object to GraphQLError", async () => {
      await expect(testInstance.testMethodWithPlainError()).rejects.toThrow(
        GraphQLError
      );
    });

    it("should not modify successful responses", async () => {
      const result = await testInstance.testMethodSuccess();
      expect(result).toBe("success");
    });
  });

  describe("isRpcErrorType", () => {
    it("should return true for valid RpcErrorType object", () => {
      const validError = {
        message: "Test error",
        errorType: {
          errorCode: "TEST_ERROR",
          errorStatus: HttpStatus.BAD_REQUEST,
        },
      };
      expect(isRpcErrorType(validError)).toBe(true);
    });

    it("should return false for invalid objects", () => {
      const invalidCases = [
        null,
        undefined,
        {},
        { message: "Test" },
        { errorType: {} },
        { message: "Test", errorType: null },
        { message: "Test", errorType: { errorCode: "TEST" } },
        { message: "Test", errorType: { errorStatus: 400 } },
      ];

      invalidCases.forEach((testCase) => {
        expect(isRpcErrorType(testCase)).toBe(false);
      });
    });
  });
});
