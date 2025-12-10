import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'], // Solo logs de errores y advertencias en producción
  });
  const config = app.get(ConfigService);

  // Configurar validación automática con class-validator en todos los endpoints
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades no definidas en el DTO
      forbidNonWhitelisted: true, // Lanza error si hay propiedades no permitidas
      transform: true, // Transforma automáticamente los tipos de datos
    }),
  );

  // Aplicar filtro global para formatear excepciones HTTP
  app.useGlobalFilters(new HttpExceptionFilter());
  
  // Aplicar interceptor global para transformar todas las respuestas
  app.useGlobalInterceptors(new TransformInterceptor());

  // Enable CORS to allow requests from frontend
  app.enableCors();

  // Swagger configuration for interactive API documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('TechHelpDesk API')
    .setDescription('REST API for technical support ticket management system')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter your JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'TechHelpDesk API Docs',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  const port = config.get<number>('PORT') || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation: http://localhost:${port}/api/docs`);
}
bootstrap();

