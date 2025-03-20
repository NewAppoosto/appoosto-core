import { DynamicModule, Module } from "@nestjs/common";
import { ClientsModule } from "@nestjs/microservices";
import { RabbitMQConfig, createRabbitMQOptions } from "./types";
import { InjectAbleServiceNames } from "../../constants";

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
          createRabbitMQOptions(InjectAbleServiceNames.Notification, config),
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
            name: InjectAbleServiceNames.Notification,
            useFactory: async () => {
              const options = await configFactory();
              const { isGlobal = false, ...config } = options;
              if (isGlobal) {
                // Update the module's global status
                this.forRoot(options);
              }
              return createRabbitMQOptions(
                InjectAbleServiceNames.Notification,
                config
              );
            },
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }
}
