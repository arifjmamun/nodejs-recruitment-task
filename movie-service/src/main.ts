import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { GlobalExceptionFilter, GlobalResponseTransformer } from '@app/utils';
import { AppModule } from './app.module';
import { appConfig } from './config/app.config';
import { setupSwagger } from './setupSwagger';

const bootstrap = async () => {
	const logger = new Logger('Startup');
	const app = await NestFactory.create<NestExpressApplication>(AppModule);
	app.disable('x-powered-by');

	const validationPipe = new ValidationPipe({
		whitelist: true,
		stopAtFirstError: true,
		transform: true,
	});

	app.useGlobalPipes(validationPipe);
	app.useGlobalFilters(new GlobalExceptionFilter());
	app.useGlobalInterceptors(new GlobalResponseTransformer());
	app.enableCors();

	setupSwagger(app);

	await app.listen(appConfig.port);
	logger.log(`Movie service running at http://localhost:${appConfig.port}/docs`);
};

bootstrap();
