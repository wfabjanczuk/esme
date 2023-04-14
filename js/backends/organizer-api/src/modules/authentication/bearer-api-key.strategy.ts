import { Strategy } from 'passport-http-bearer';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BearerApiKeyStrategy extends PassportStrategy(
  Strategy,
  'bearer-api-key',
) {
  constructor(private configService: ConfigService) {
    super();
  }

  validate(apiKey: string): boolean {
    if (apiKey !== this.configService.get('ORGANIZER_API_KEY')) {
      throw new UnauthorizedException('invalid api key');
    }

    return true;
  }
}
