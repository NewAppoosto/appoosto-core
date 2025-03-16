import { ErrorTypes } from "../constants";
import { ApiError, asyncHandler, customErrorHandler } from "../utils";

/**
 * Example resolver using the error handling pattern
 */
export const createUserExample = asyncHandler(async (parent, args, context) => {
  const { email } = args;

  // Check if user exists (example)
  const userExists = await context.db.users.findOne({ email });

  if (userExists) {
    throw new ApiError("Email Already Registered", ErrorTypes.ALREADY_EXISTS);
  }

  // Continue with user creation...
  const newUser = await context.db.users.create({ email });

  return newUser;
});

/**
 * Example of direct error throwing
 */
export const validateUserExample = (userData: any) => {
  if (!userData.email) {
    customErrorHandler("Email is required", ErrorTypes.BAD_USER_INPUT);
  }

  if (!userData.password || userData.password.length < 8) {
    customErrorHandler(
      "Password must be at least 8 characters",
      ErrorTypes.BAD_USER_INPUT
    );
  }

  return true;
};
