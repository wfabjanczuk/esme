import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { projectName } from '@esme/common';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return projectName;
  }
}
