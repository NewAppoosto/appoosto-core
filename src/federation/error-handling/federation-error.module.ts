import { DynamicModule, Module } from "@nestjs/common";
import { FederationErrorHandlerConfig } from "./types";
import { FederationErrorPluginService } from "./error-plugin.service";
import { FederationErrorFormatterService } from "./error-formatter.service";

@Module({
  providers: [FederationErrorPluginService, FederationErrorFormatterService],
  exports: [FederationErrorPluginService, FederationErrorFormatterService],
})
export class FederationErrorModule {
  static forRoot(config: FederationErrorHandlerConfig = {}): DynamicModule {
    return {
      module: FederationErrorModule,
      global: true,
      providers: [
        {
          provide: "FEDERATION_ERROR_CONFIG",
          useValue: {
            includeStacktrace: config.includeStacktrace ?? false,
            debug: config.debug ?? false,
          },
        },
      ],
      exports: ["FEDERATION_ERROR_CONFIG"],
    };
  }

  static getDefaultOptions(
    pluginService: FederationErrorPluginService,
    formatterService: FederationErrorFormatterService
  ) {
    return {
      server: {
        plugins: [pluginService.createPlugin()],
        formatError: formatterService.formatError.bind(formatterService),
        includeStacktraceInErrorResponses: false,
        debug: false,
      },
    };
  }
}
