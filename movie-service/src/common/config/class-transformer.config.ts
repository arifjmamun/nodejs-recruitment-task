import { ClassTransformOptions } from 'class-transformer';

export const classTransformOptions: ClassTransformOptions = {
	exposeUnsetFields: true,
	exposeDefaultValues: true,
	enableCircularCheck: true,
	excludeExtraneousValues: true,
};
