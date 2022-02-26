import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { appConfig } from '../common/config/app.config';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
	imports: [PassportModule, JwtModule.register({ secret: appConfig.jwtSecret })],
	providers: [JwtStrategy],
})
export class AuthModule {}
