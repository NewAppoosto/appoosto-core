import { DynamicModule, Module } from "@nestjs/common";
import { ClientsModule } from "@nestjs/microservices";
import { RabbitMQConfig, createRabbitMQOptions } from "./types";
import { InjectAbleServiceNames } from "../../constants";

interface RabbitMQProfileModuleOptions extends RabbitMQConfig {
  isGlobal?: boolean;
}

@Module({})
export class RabbitMQProfileModule {
  static forRoot(options: RabbitMQProfileModuleOptions): DynamicModule {
    const { isGlobal = false, ...config } = options;
    return {
      module: RabbitMQProfileModule,
      global: isGlobal,
      imports: [
        ClientsModule.register([
          createRabbitMQOptions(InjectAbleServiceNames.Profile, config),
        ]),
      ],
      exports: [ClientsModule],
    };
  }

  static forRootAsync(
    configFactory: () =>
      | Promise<RabbitMQProfileModuleOptions>
      | RabbitMQProfileModuleOptions
  ): DynamicModule {
    return {
      module: RabbitMQProfileModule,
      global: false, // Will be overridden by the config if specified
      imports: [
        ClientsModule.registerAsync([
          {
            name: InjectAbleServiceNames.Profile,
            useFactory: async () => {
              const options = await configFactory();
              const { isGlobal = false, ...config } = options;
              if (isGlobal) {
                // Update the module's global status
                this.forRoot(options);
              }
              return createRabbitMQOptions(InjectAbleServiceNames.Profile, config);
            },
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }
}
