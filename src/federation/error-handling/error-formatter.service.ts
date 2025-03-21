import { Injectable } from "@nestjs/common";
import { GraphQLError, GraphQLFormattedError } from "graphql";
import { ErrorResponse } from "./types";

@Injectable()
export class FederationErrorFormatterService {
  formatError(error: GraphQLError): GraphQLFormattedError {
    const response = error.extensions?.response as ErrorResponse | undefined;
    const originalError = response?.body?.errors?.[0];

    if (originalError) {
      return {
        message: originalError.message,
        locations: originalError.locations,
        path: originalError.path,
        extensions: originalError.extensions,
      };
    }

    return error;
  }
}
