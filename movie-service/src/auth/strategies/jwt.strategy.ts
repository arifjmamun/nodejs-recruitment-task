import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';

import { appConfig } from '../../common/config/app.config';
import { AuthUser } from '../interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: appConfig.jwtSecret,
		} as StrategyOptions);
	}

	validate(tokenPayload: AuthUser) {
		return tokenPayload;
	}

	handleRequest(err: any, user: any, _: any) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
