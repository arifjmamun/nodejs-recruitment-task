import { TestingModule } from '@nestjs/testing';

import { MoviesController } from '../controllers/movies.controller';
import { createMoviesTestingModule } from './createModule';

describe('MoviesController', () => {
	let controller: MoviesController;
	let module: TestingModule;

	jest.setTimeout(120000);

	beforeAll(async () => {
		const testModule = await createMoviesTestingModule();
		controller = testModule.controller;
		module = testModule.module;
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	afterAll(async () => await module.close());
});
