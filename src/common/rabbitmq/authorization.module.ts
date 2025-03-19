import { DynamicModule, Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { RabbitMQConfig, createRabbitMQOptions } from './types';

interface RabbitMQAuthorizationModuleOptions extends RabbitMQConfig {
  isGlobal?: boolean;
}

@Module({})
export class RabbitMQAuthorizationModule {
  static forRoot(options: RabbitMQAuthorizationModuleOptions): DynamicModule {
    const { isGlobal = false, ...config } = options;
    return {
      module: RabbitMQAuthorizationModule,
      global: isGlobal,
      imports: [
        ClientsModule.register([
          createRabbitMQOptions('AUTHORIZATION_SERVICE', config),
        ]),
      ],
      exports: [ClientsModule],
    };
  }

  static forRootAsync(
    configFactory: () =>
      | Promise<RabbitMQAuthorizationModuleOptions>
      | RabbitMQAuthorizationModuleOptions,
  ): DynamicModule {
    return {
      module: RabbitMQAuthorizationModule,
      global: false, // Will be overridden by the config if specified
      imports: [
        ClientsModule.registerAsync([
          {
            name: 'AUTHORIZATION_SERVICE',
            useFactory: async () => {
              const options = await configFactory();
              const { isGlobal = false, ...config } = options;
              if (isGlobal) {
                // Update the module's global status
                this.forRoot(options);
              }
              return createRabbitMQOptions('AUTHORIZATION_SERVICE', config);
            },
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }
}
