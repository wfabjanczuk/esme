import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { projectName } from '@esme/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('ESME CMS API')
    .setDescription(projectName)
    .setVersion('1.0')
    .addTag('Users')
    .addTag('Agencies')
    .addTag('Events')
    .addTag('Contacts')
    .addTag('Announcements')
    .addTag('Changelogs')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
