import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from 'process';

export const configSwagger = (app) => {
  const config = new DocumentBuilder()
    .setTitle('Registration API')
    .setDescription('Teacher/student registration and notification API')
    .setVersion('1.0')
    .addServer('http://localhost:8000/')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'jwt',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  return config;
};
