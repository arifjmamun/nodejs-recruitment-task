import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';
import { Error } from 'mongoose';

import ValidationError = Error.ValidationError;

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
	private logger = new Logger('Exception Filter');

	catch(exception: any, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();

		let error = 'Internal Server Error';
		let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

		if (exception instanceof HttpException) {
			const response = exception.getResponse() as { message?: any };
			error = Array.isArray(response.message) ? response.message.join(', ') : response.message;
			statusCode = exception.getStatus();
		} else if (exception instanceof ValidationError) {
			error = exception.message;
			statusCode = HttpStatus.BAD_REQUEST;
		}

		this.logger.error(exception.message, exception.stack);

		response.status(statusCode).json({
			success: false,
			data: null,
			error,
		});
	}
}
