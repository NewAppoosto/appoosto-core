import { GraphQLScalarType, ValueNode } from "graphql";
import { ApiError } from "../utils";
import { ErrorTypes } from "../constants";

const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function validate(uuid: unknown): string | never {
  if (typeof uuid !== "string" || !regex.test(uuid)) {
    throw new ApiError("invalid uuid", ErrorTypes.BAD_USER_INPUT);
  }
  return uuid;
}

export const CustomUuidScalar = new GraphQLScalarType({
  name: "UUID",
  description: "A simple UUID parser",
  serialize: (value: unknown) => validate(value),
  parseValue: (value: unknown) => validate(value),
  parseLiteral: (ast: ValueNode) => {
    if (ast.kind === "StringValue") {
      return validate(ast.value);
    }
    throw new ApiError("invalid uuid", ErrorTypes.BAD_USER_INPUT);
  },
});

// DateTime scalar for handling dates
export const DateTimeScalar = new GraphQLScalarType({
  name: "DateTime",
  description: "A date-time string at UTC, such as 2007-12-03T10:15:30Z",
  serialize: (value: unknown) => {
    if (value instanceof Date) {
      return value.toISOString();
    }
    throw new ApiError("Invalid date", ErrorTypes.BAD_USER_INPUT);
  },
  parseValue: (value: unknown) => {
    if (typeof value === "string") {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        throw new ApiError("Invalid date", ErrorTypes.BAD_USER_INPUT);
      }
      return date;
    }
    throw new ApiError("Invalid date", ErrorTypes.BAD_USER_INPUT);
  },
  parseLiteral: (ast: ValueNode) => {
    if (ast.kind === "StringValue") {
      const date = new Date(ast.value);
      if (isNaN(date.getTime())) {
        throw new ApiError("Invalid date", ErrorTypes.BAD_USER_INPUT);
      }
      return date;
    }
    throw new ApiError("Invalid date", ErrorTypes.BAD_USER_INPUT);
  },
});

// Email scalar for validating email addresses
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const EmailScalar = new GraphQLScalarType({
  name: "Email",
  description: "A valid email address",
  serialize: (value: unknown) => {
    if (typeof value === "string" && emailRegex.test(value)) {
      return value;
    }
    throw new ApiError("Invalid email address", ErrorTypes.BAD_USER_INPUT);
  },
  parseValue: (value: unknown) => {
    if (typeof value === "string" && emailRegex.test(value)) {
      return value;
    }
    throw new ApiError("Invalid email address", ErrorTypes.BAD_USER_INPUT);
  },
  parseLiteral: (ast: ValueNode) => {
    if (ast.kind === "StringValue") {
      if (!emailRegex.test(ast.value)) {
        throw new ApiError("Invalid email address", ErrorTypes.BAD_USER_INPUT);
      }
      return ast.value;
    }
    throw new ApiError("Invalid email address", ErrorTypes.BAD_USER_INPUT);
  },
});

// Phone number scalar for validating phone numbers
const phoneRegex = /^\+[0-9]{2}-[0-9]{10,}$/;

export const PhoneNumberScalar = new GraphQLScalarType({
  name: "PhoneNumber",
  description:
    "A valid phone number in format +XX-XXXXXXXXXXX (e.g., +88-01313545778)",
  serialize: (value: unknown) => {
    if (typeof value === "string" && phoneRegex.test(value)) {
      return value;
    }
    throw new ApiError(
      "Invalid phone number format. Expected format: +XX-XXXXXXXXXXX (e.g., +88-01313545778)",
      ErrorTypes.BAD_USER_INPUT
    );
  },
  parseValue: (value: unknown) => {
    if (typeof value === "string" && phoneRegex.test(value)) {
      return value;
    }
    throw new ApiError(
      "Invalid phone number format. Expected format: +XX-XXXXXXXXXXX (e.g., +88-01313545778)",
      ErrorTypes.BAD_USER_INPUT
    );
  },
  parseLiteral: (ast: ValueNode) => {
    if (ast.kind === "StringValue") {
      if (!phoneRegex.test(ast.value)) {
        throw new ApiError(
          "Invalid phone number format. Expected format: +XX-XXXXXXXXXXX (e.g., +88-01313545778)",
          ErrorTypes.BAD_USER_INPUT
        );
      }
      return ast.value;
    }
    throw new ApiError(
      "Invalid phone number format. Expected format: +XX-XXXXXXXXXXX (e.g., +88-01313545778)",
      ErrorTypes.BAD_USER_INPUT
    );
  },
});

// JSON scalar for handling arbitrary JSON data
export const JSONScalar = new GraphQLScalarType({
  name: "JSON",
  description: "Arbitrary JSON data",
  serialize: (value: unknown) => {
    try {
      return JSON.stringify(value);
    } catch {
      throw new ApiError("Invalid JSON", ErrorTypes.BAD_USER_INPUT);
    }
  },
  parseValue: (value: unknown) => {
    if (typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch {
        throw new ApiError("Invalid JSON", ErrorTypes.BAD_USER_INPUT);
      }
    }
    throw new ApiError("Invalid JSON", ErrorTypes.BAD_USER_INPUT);
  },
  parseLiteral: (ast: ValueNode) => {
    if (ast.kind === "StringValue") {
      try {
        return JSON.parse(ast.value);
      } catch {
        throw new ApiError("Invalid JSON", ErrorTypes.BAD_USER_INPUT);
      }
    }
    throw new ApiError("Invalid JSON", ErrorTypes.BAD_USER_INPUT);
  },
});
