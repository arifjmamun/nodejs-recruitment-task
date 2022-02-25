import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const setupSwagger = (app: INestApplication) => {
	const options = new DocumentBuilder()
		.setTitle('Movie Service')
		.setDescription('Movie Service Api Docs')
		.addBearerAuth({
			description: 'Movie Service Bearer JWT Token',
			type: 'http',
			name: 'Authorization',
			bearerFormat: 'JWT',
		})
		.setVersion('1.0')
		.build();

	const document = SwaggerModule.createDocument(app, options);
	SwaggerModule.setup('docs', app, document, {
		swaggerOptions: {
			persistAuthorization: true,
			syntaxHighlight: {
				activate: true,
				theme: 'obsidian',
			},
			docExpansion: 'none',
			displayRequestDuration: true,
			defaultModelExpandDepth: 8,
			defaultModelsExpandDepth: 8,
		},
		customSiteTitle: 'Movie Service Api Docs',
	});
};
