import 'reflect-metadata';
import 'source-map-support/register';

import { Env, parseEnv } from 'atenv';
import { Transform } from 'class-transformer';
import { IsDefined, IsOptional } from 'class-validator';

export class AppConfig {
	@Env('PORT')
	@IsOptional()
	@Transform(({ value }) => parseInt(value, 10))
	port = 4000;

	@IsDefined({ message: 'MongoDB URL is required in .env file' })
	@Env('MONGO_URL')
	mongoURL: string;
}

export const appConfig = parseEnv(AppConfig);
