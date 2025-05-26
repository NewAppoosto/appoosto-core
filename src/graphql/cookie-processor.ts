import { RemoteGraphQLDataSource } from "@apollo/gateway";
import {
  ApolloServerPlugin,
  GraphQLRequestContext,
  GraphQLRequestListener,
} from "@apollo/server";

interface ServerContext {
  passthrough_cookies?: string;
  [key: string]: any;
}

export class CookieProcessorDataSource extends RemoteGraphQLDataSource {
  didReceiveResponse({
    response,
    context,
  }: {
    response: any;
    context: any;
  }): any {
    if (response.http?.headers && response.http.headers.get("set-cookie")) {
      const setCookieHeader = response.http.headers.get("set-cookie");
      if (setCookieHeader) {
        context.passthrough_cookies = setCookieHeader;
      }
    }
    return response;
  }
}

export class CookieServerListener
  implements GraphQLRequestListener<ServerContext>
{
  public willSendResponse({
    contextValue,
    response,
  }: GraphQLRequestContext<ServerContext>): Promise<void> {
    if (contextValue?.passthrough_cookies) {
      response.http.headers.set("set-cookie", contextValue.passthrough_cookies);
    }

    return Promise.resolve();
  }
}

export class CookieServerPlugin implements ApolloServerPlugin<ServerContext> {
  async requestDidStart(): Promise<GraphQLRequestListener<ServerContext> | void> {
    return new CookieServerListener();
  }
}
