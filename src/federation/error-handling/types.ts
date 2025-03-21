import { GraphQLError } from "graphql";

export interface SubgraphError {
  message: string;
  locations?: Array<{ line: number; column: number }>;
  path?: string[];
  extensions?: Record<string, any>;
}

export interface ErrorResponse {
  body: {
    errors: SubgraphError[];
  };
}

export interface ResponseWithHttp {
  http: {
    status: number;
  };
}

export interface FederationErrorHandlerConfig {
  /**
   * Whether to include stack traces in error responses
   * @default false
   */
  includeStacktrace?: boolean;

  /**
   * Whether to enable debug mode
   * @default false
   */
  debug?: boolean;
}
