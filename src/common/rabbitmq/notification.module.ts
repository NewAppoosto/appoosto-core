import { DynamicModule, Module } from "@nestjs/common";
import { ClientsModule } from "@nestjs/microservices";
import { RabbitMQConfig, createRabbitMQOptions } from "./types";

interface RabbitMQNotificationModuleOptions extends RabbitMQConfig {
  isGlobal?: boolean;
}

@Module({})
export class RabbitMQNotificationModule {
  static forRoot(options: RabbitMQNotificationModuleOptions): DynamicModule {
    const { isGlobal = false, ...config } = options;
    return {
      module: RabbitMQNotificationModule,
      global: isGlobal,
      imports: [
        ClientsModule.register([
          createRabbitMQOptions("NOTIFICATION_SERVICE", config),
        ]),
      ],
      exports: [ClientsModule],
    };
  }

  static forRootAsync(
    configFactory: () =>
      | Promise<RabbitMQNotificationModuleOptions>
      | RabbitMQNotificationModuleOptions
  ): DynamicModule {
    return {
      module: RabbitMQNotificationModule,
      global: false, // Will be overridden by the config if specified
      imports: [
        ClientsModule.registerAsync([
          {
            name: "NOTIFICATION_SERVICE",
            useFactory: async () => {
              const options = await configFactory();
              const { isGlobal = false, ...config } = options;
              if (isGlobal) {
                // Update the module's global status
                this.forRoot(options);
              }
              return createRabbitMQOptions("NOTIFICATION_SERVICE", config);
            },
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }
}
