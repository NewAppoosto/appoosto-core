import { DynamicModule, Module } from "@nestjs/common";
import { ClientsModule } from "@nestjs/microservices";
import { RabbitMQConfig, createRabbitMQOptions } from "./types";

interface RabbitMQUserModuleOptions extends RabbitMQConfig {
  isGlobal?: boolean;
}

@Module({})
export class RabbitMQUserModule {
  static forRoot(options: RabbitMQUserModuleOptions): DynamicModule {
    const { isGlobal = false, ...config } = options;
    return {
      module: RabbitMQUserModule,
      global: isGlobal,
      imports: [
        ClientsModule.register([createRabbitMQOptions("USER_SERVICE", config)]),
      ],
      exports: [ClientsModule],
    };
  }

  static forRootAsync(
    configFactory: () =>
      | Promise<RabbitMQUserModuleOptions>
      | RabbitMQUserModuleOptions
  ): DynamicModule {
    return {
      module: RabbitMQUserModule,
      global: false, // Will be overridden by the config if specified
      imports: [
        ClientsModule.registerAsync([
          {
            name: "USER_SERVICE",
            useFactory: async () => {
              const options = await configFactory();
              const { isGlobal = false, ...config } = options;
              if (isGlobal) {
                // Update the module's global status
                this.forRoot(options);
              }
              return createRabbitMQOptions("USER_SERVICE", config);
            },
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }
}
