import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(private configService: ConfigService) {}
  @Get()
  getHello(): string {
    const message = this.configService.get('MESSAGE');
    return message;
  }

  //서버 환경별로 환경변수 사용하기 테스팅 컨트롤러
  @Get('service-url')
  getServiceUrl(): string | undefined {
    return this.configService.get('SERVICE_URL');
  }
}
