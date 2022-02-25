import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class GlobalResponseTransformer<T> implements NestInterceptor<T, Response<T>> {
	/**
	 * @param renderHTML - default true
	 */
	constructor(private renderHTML = true) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		if (this.renderHTML) {
			const contentType = context.switchToHttp().getResponse<Response>().getHeader('Content-Type');
			if (typeof contentType === 'string' && contentType.startsWith('text/html')) return next.handle();
		}

		return next.handle().pipe(
			map((data) => ({
				success: true,
				data: data,
				error: null,
			})),
		);
	}
}
