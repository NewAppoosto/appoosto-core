import { ApiError } from "../apiError";
import { HttpStatus } from "@nestjs/common";

describe("ApiError", () => {
  it("should create an ApiError with default message", () => {
    const errorType = {
      errorCode: "ERR001",
      errorStatus: HttpStatus.BAD_REQUEST,
    };
    const error = new ApiError(undefined, errorType);

    expect(error.message).toBe("Something went wrong");
    expect(error.errorType).toEqual(errorType);
  });

  it("should create an ApiError with a custom message", () => {
    const errorType = {
      errorCode: "ERR002",
      errorStatus: HttpStatus.NOT_FOUND,
    };
    const error = new ApiError("Custom error message", errorType);

    expect(error.message).toBe("Custom error message");
    expect(error.errorType).toEqual(errorType);
  });
});
