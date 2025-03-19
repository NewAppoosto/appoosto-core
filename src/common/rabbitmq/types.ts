import { ClientProviderOptions, Transport } from '@nestjs/microservices';

export interface RabbitMQConfig {
  urls: string[];
  queue: string;
}

export interface RabbitMQModuleOptions {
  name: string;
  config: RabbitMQConfig;
}

export const createRabbitMQOptions = (
  name: string,
  config: RabbitMQConfig,
): ClientProviderOptions => ({
  name,
  transport: Transport.RMQ,
  options: {
    urls: config.urls,
    queue: config.queue,
  },
});
