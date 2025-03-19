import { DynamicModule, Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { RabbitMQConfig, createRabbitMQOptions } from './types';

@Module({})
export class RabbitMQNotificationModule {
  static register(config: RabbitMQConfig): DynamicModule {
    return {
      module: RabbitMQNotificationModule,
      imports: [
        ClientsModule.register([
          createRabbitMQOptions('NOTIFICATION_SERVICE', config),
        ]),
      ],
      exports: [ClientsModule],
    };
  }

  static registerAsync(
    configFactory: () => Promise<RabbitMQConfig> | RabbitMQConfig,
  ): DynamicModule {
    return {
      module: RabbitMQNotificationModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name: 'NOTIFICATION_SERVICE',
            useFactory: async () => {
              const config = await configFactory();
              return createRabbitMQOptions('NOTIFICATION_SERVICE', config);
            },
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }
}
