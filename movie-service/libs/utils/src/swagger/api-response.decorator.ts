import { applyDecorators } from '@nestjs/common';
import {
	ApiResponseOptions,
	ApiOkResponse as OkResponse,
	ApiCreatedResponse as CreatedResponse,
	ApiOperation,
} from '@nestjs/swagger';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export const ApiOkResponse = (option: ApiResponseOptions & Partial<OperationObject>) => {
	return applyDecorators(
		ApiOperation({
			description: option.description,
			summary: option.summary || option.description,
			operationId: option.operationId,
		}),
		OkResponse(option),
	);
};

export const ApiCreatedResponse = (option: ApiResponseOptions & Partial<OperationObject>) => {
	return applyDecorators(
		ApiOperation({
			description: option.description,
			summary: option.summary || option.description,
			operationId: option.operationId,
		}),
		CreatedResponse(option),
	);
};
