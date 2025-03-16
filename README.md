# @appoosto/core

Core types, interfaces, and utility functions for Appoosto backend microservices.

## Error Handling

This package provides a standardized way to handle errors across all Appoosto microservices.

### Installation

This package is not published on npm and is only available through GitHub.

You can install this package directly from GitHub:

```bash
npm install github:NewAppoosto/appoosto-core#main
```

Or with a specific version tag:

```bash
npm install github:NewAppoosto/appoosto-core#v0.1.1
```

Alternatively, add it to your `package.json` dependencies:

```json
"dependencies": {
  "@appoosto/core": "github:NewAppoosto/appoosto-core#main"
}
```

**Note:** If the repository is private, you'll need to set up authentication for npm to access GitHub. This typically involves creating a GitHub Personal Access Token with the appropriate permissions.

### Version Tags

This package uses Git tags for versioning. When you reference a specific version (e.g., `github:NewAppoosto/appoosto-core#v0.1.1`), you're pointing to a Git tag.

#### Creating Version Tags

After updating the package version, create and push a Git tag:

```bash
# Use npm version to update package.json and create a tag
npm version patch

# This will automatically:
# 1. Increment the patch version in package.json
# 2. Commit the change
# 3. Create a git tag
# 4. Push the commit and tag to GitHub (due to the postversion script)
```

Your package.json already has the necessary scripts configured:

```json
"scripts": {
  "version": "git add -A",
  "postversion": "git push && git push --tags"
}
```

#### Managing Tags

View all tags:

```bash
git tag
```

Delete a tag if needed:

```bash
# Delete locally
git tag -d vx.y.z

# Delete from remote
git push --delete origin vx.y.z
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
