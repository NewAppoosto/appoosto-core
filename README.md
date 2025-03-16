# @appoosto/core

Core types, interfaces, and utility functions for Appoosto backend microservices.

## Error Handling

This package provides a standardized way to handle errors across all Appoosto microservices.

### Installation

```bash
npm install @appoosto/core
```

### Usage

#### 1. Using the AsyncHandler

Wrap your resolver functions with the `asyncHandler` to automatically catch and format errors:

```typescript
import { asyncHandler, ApiError, ErrorTypes } from "@appoosto/core";

const createUser = asyncHandler(async (parent, args, context) => {
  const { email } = args;

  // Check if user exists
  const userExists = await context.db.users.findOne({ email });

  if (userExists) {
    throw new ApiError("Email Already Registered", ErrorTypes.ALREADY_EXISTS);
  }

  // Continue with user creation...
  const newUser = await context.db.users.create({ email });

  return newUser;
});
```

#### 2. Throwing Custom Errors

You can throw custom errors directly using the `ApiError` class:

```typescript
import { ApiError, ErrorTypes } from "@appoosto/core";

if (userExists) {
  throw new ApiError("Email Already Registered", ErrorTypes.ALREADY_EXISTS);
}
```

#### 3. Using the Custom Error Handler Directly

For more control, you can use the `customErrorHandler` function directly:

```typescript
import { customErrorHandler, ErrorTypes } from "@appoosto/core";

const validateUser = (userData) => {
  if (!userData.email) {
    customErrorHandler("Email is required", ErrorTypes.BAD_USER_INPUT);
  }

  return true;
};
```

#### 4. Available Error Types

The package provides a set of predefined error types with appropriate HTTP status codes:

```typescript
import { ErrorTypes } from "@appoosto/core";

// Examples:
ErrorTypes.BAD_USER_INPUT; // 400 Bad Request
ErrorTypes.NOT_FOUND; // 404 Not Found
ErrorTypes.UN_AUTHORIZED; // 401 Unauthorized
ErrorTypes.INTERNAL_SERVER_ERROR; // 500 Internal Server Error
```

## License

MIT
