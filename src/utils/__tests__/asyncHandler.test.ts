import { asyncHandler } from "../asyncHandler";
import { ApiError } from "../apiError";
import { customErrorHandler } from "../customErrorHandler";
import { HttpStatus } from "@nestjs/common";

jest.mock("../customErrorHandler");

describe("asyncHandler", () => {
  it("should call the function and return its result", async () => {
    const mockFn = jest.fn().mockResolvedValue("success");
    const wrappedFn = asyncHandler(mockFn);

    const result = await wrappedFn();

    expect(result).toBe("success");
    expect(mockFn).toHaveBeenCalled();
  });

  it("should handle ApiError and call customErrorHandler", async () => {
    const errorType = {
      errorCode: "ERR003",
      errorStatus: HttpStatus.INTERNAL_SERVER_ERROR,
    };
    const mockFn = jest
      .fn()
      .mockRejectedValue(new ApiError("Api error occurred", errorType));
    const wrappedFn = asyncHandler(mockFn);

    await wrappedFn();

    expect(customErrorHandler).toHaveBeenCalledWith(
      "Api error occurred",
      errorType
    );
  });

  it("should handle non-ApiError and call customErrorHandler with default error", async () => {
    const mockFn = jest.fn().mockRejectedValue(new Error("Unknown error"));
    const wrappedFn = asyncHandler(mockFn);

    await wrappedFn();

    expect(customErrorHandler).toHaveBeenCalledWith(
      "Something Went Wrong!",
      expect.any(Object)
    );
  });
});
