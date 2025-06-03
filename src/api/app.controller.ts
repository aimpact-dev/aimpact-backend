import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/decorator/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Get('test-error')
  testError() {
    throw new Error('My first sentry error');
  }
}
