import { HttpStatus } from "@nestjs/common";

// Apollo Server Error Codes (copied from @apollo/server/errors)
export const ApolloServerErrorCode = {
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  GRAPHQL_PARSE_FAILED: "GRAPHQL_PARSE_FAILED",
  GRAPHQL_VALIDATION_FAILED: "GRAPHQL_VALIDATION_FAILED",
  PERSISTED_QUERY_NOT_FOUND: "PERSISTED_QUERY_NOT_FOUND",
  PERSISTED_QUERY_NOT_SUPPORTED: "PERSISTED_QUERY_NOT_SUPPORTED",
  BAD_USER_INPUT: "BAD_USER_INPUT",
  OPERATION_RESOLUTION_FAILURE: "OPERATION_RESOLUTION_FAILURE",
  BAD_REQUEST: "BAD_REQUEST",
};

export const ErrorTypes = {
  BAD_USER_INPUT: {
    errorCode: ApolloServerErrorCode.BAD_USER_INPUT,
    errorStatus: HttpStatus.BAD_REQUEST,
  },
  BAD_REQUEST: {
    errorCode: ApolloServerErrorCode.BAD_REQUEST,
    errorStatus: HttpStatus.BAD_REQUEST,
  },
  NOT_FOUND: {
    errorCode: "NOT_FOUND",
    errorStatus: HttpStatus.NOT_FOUND,
  },
  UN_AUTHORIZED: {
    errorCode: "UN_AUTHORIZED",
    errorStatus: HttpStatus.UNAUTHORIZED,
  },
  AUTHORIZATION_HEADER_MISSING: {
    errorCode: "AUTHORIZATION_HEADER_MISSING",
    errorStatus: HttpStatus.FORBIDDEN,
  },
  ALREADY_EXISTS: {
    errorCode: "ALREADY_EXISTS",
    errorStatus: HttpStatus.BAD_REQUEST,
  },
  INVALID_LINK: {
    errorCode: "INVALID_LINK",
    errorStatus: HttpStatus.BAD_REQUEST,
  },
  INTERNAL_SERVER_ERROR: {
    errorCode: ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
    errorStatus: HttpStatus.INTERNAL_SERVER_ERROR,
  },
};
