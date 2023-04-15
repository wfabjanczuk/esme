import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const Issuer = 'esme.com';
export const OrganizerTokenPrefix = 'organizer';

export interface JwtPayload {
  sub: number;
  iat: number;
  nbf: number;
  exp: number;
  iss: string;
  aud: string[];
}

const jwtModuleFactory = (configService: ConfigService): JwtModuleOptions => ({
  secret: configService.get('JWT_SECRET'),
  signOptions: {
    expiresIn: '24h',
    notBefore: 0,
    issuer: Issuer,
    audience: [Issuer],
  },
});

export const jwtModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: jwtModuleFactory,
};
