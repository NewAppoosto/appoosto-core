import { Injectable } from "@nestjs/common";
import { SubgraphError } from "./types";

@Injectable()
export class FederationErrorPluginService {
  createPlugin() {
    return {
      requestDidStart() {
        return {
          async willSendResponse({ response, errors }) {
            if (errors?.length) {
              const firstError = errors[0];

              // Check for direct permission errors
              if (firstError.extensions?.code === "FORBIDDEN") {
                response.http.status = 403;
                return;
              }

              // Check for wrapped permission errors
              const originalError = firstError.extensions?.response?.body
                ?.errors?.[0] as SubgraphError | undefined;

              if (originalError?.extensions?.code === "FORBIDDEN") {
                response.http.status = 403;
                return;
              }

              // For other errors, use the original status code logic
              const statusCode =
                originalError?.extensions?.status ||
                firstError.extensions?.status ||
                500;
              response.http.status = statusCode;
            }
          },
        };
      },
    };
  }
}
