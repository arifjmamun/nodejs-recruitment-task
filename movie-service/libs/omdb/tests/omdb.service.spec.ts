import { BadRequestException } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';

import { OmdbService } from '../src/omdb.service';
import { createOmdbTestingModule } from './createModule';

describe('MoviesService', () => {
	let module: TestingModule;
	let service: OmdbService;

	jest.setTimeout(120000);

	beforeAll(async () => {
		const moduleRef = await createOmdbTestingModule();
		module = moduleRef.module;
		service = moduleRef.service;
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should get a movie by title', async () => {
		const movieTitle = 'Man of Steel';
		const movie = await service.getMovieByTitle(movieTitle);

		expect(movie).toBeTruthy();
		expect(movie.Title.toLowerCase()).toContain(movieTitle.toLowerCase());
		expect(movie.Released).toBeTruthy();
		expect(movie.Director).toBeTruthy();
		expect(movie.Genre).toBeTruthy();
	});

	it('should get a movie by IMDB ID', async () => {
		const imdbId = 'tt2382320';
		const movie = await service.getMovieByIMDBId(imdbId);

		expect(movie).toBeTruthy();
		expect(imdbId).toEqual(movie.imdbID);
		expect(movie.Title).toBeTruthy();
		expect(movie.Released).toBeTruthy();
		expect(movie.Director).toBeTruthy();
		expect(movie.Genre).toBeTruthy();
	});

	it('should throw `BadRequestException` with invalid movie title', async () => {
		try {
			await service.getMovieByTitle('57difs5468fd');
		} catch (error) {
			expect(error).toBeInstanceOf(BadRequestException);
		}
	});

	it('should throw `BadRequestException` with invalid IMDB ID', async () => {
		try {
			await service.getMovieByTitle('tt238232064645646456');
		} catch (error) {
			expect(error).toBeInstanceOf(BadRequestException);
		}
	});

	afterAll(async () => await module.close());
});
