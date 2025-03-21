import { Injectable } from "@nestjs/common";
import { SubgraphError } from "./types";

@Injectable()
export class FederationErrorPluginService {
  createPlugin() {
    return {
      requestDidStart() {
        return {
          async willSendResponse({ response, errors }: any) {
            if (errors?.length) {
              const firstError = errors[0];
              const originalError = firstError.extensions?.response?.body
                ?.errors?.[0] as SubgraphError | undefined;
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
