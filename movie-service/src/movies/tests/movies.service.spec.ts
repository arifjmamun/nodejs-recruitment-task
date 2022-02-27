import { TestingModule } from '@nestjs/testing';

import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { AuthRole, AuthUser } from '../../auth/interfaces';
import { MoviesService } from '../services/movies.service';
import { createMoviesTestingModule, MoviesServiceMock } from './createModule';
import { CreateMovieDto } from '../dto';
import { getRandomMovieTitle, moviesCollection } from './movies-collection.data';
import { MovieAddLimitReachedException, MovieAlreadyExistsException, MovieNotFoundException } from '../exceptions';

const testBasicUser: AuthUser = {
	name: 'Test basic user',
	role: AuthRole.Basic,
	userId: 123,
};

const testPremiumUser: AuthUser = {
	name: 'Test premium user',
	role: AuthRole.Premium,
	userId: 423,
};

const testQuery = new PaginationQueryDto();
testQuery.setDefaults();

describe('MoviesService', () => {
	let module: TestingModule;
	let service: MoviesService;

	jest.setTimeout(120000);

	beforeEach(async () => {
		MoviesServiceMock.reset(service);
	});

	beforeAll(async () => {
		const moduleRef = await createMoviesTestingModule();
		module = moduleRef.module;
		service = moduleRef.service;
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should get movies of empty list', async () => {
		const getMoviesSpy = jest.spyOn(service, 'getMovies');

		const movies = await service.getMovies(testQuery, testBasicUser);

		expect(movies).toBeTruthy();
		expect(movies.length).toBe(0);
		expect(getMoviesSpy).toHaveBeenCalledWith(testQuery, testBasicUser);
	});

	it('should get movies of basic user', async () => {
		const getMoviesSpy = jest.spyOn(service, 'getMovies');

		moviesCollection.slice(0, 5).forEach(async (item) => {
			await service.addMovie({ title: item.Title }, testBasicUser);
		});

		moviesCollection.forEach(async (item) => {
			await service.addMovie({ title: item.Title }, testPremiumUser);
		});

		const movies = await service.getMovies(testQuery, testBasicUser);
		
		expect(movies).toBeTruthy();
		expect(movies.length).toBe(5);

		movies.forEach(item => {
			expect(item.createdBy).toEqual(testBasicUser.userId);
		});
		expect(getMoviesSpy).toHaveBeenCalledWith(testQuery, testBasicUser);
	});

	it('should get movies of premium user', async () => {
		const getMoviesSpy = jest.spyOn(service, 'getMovies');

		moviesCollection.slice(0, 5).forEach(async (item) => {
			await service.addMovie({ title: item.Title }, testBasicUser);
		});

		moviesCollection.forEach(async (item) => {
			await service.addMovie({ title: item.Title }, testPremiumUser);
		});

		const movies = await service.getMovies(testQuery, testPremiumUser);
		
		expect(movies).toBeTruthy();
		expect(movies.length).toBe(moviesCollection.length);

		movies.forEach(item => {
			expect(item.createdBy).toEqual(testPremiumUser.userId);
		});
		expect(getMoviesSpy).toHaveBeenCalledWith(testQuery, testPremiumUser);
	});

	it('should add a movie', async () => {
		const dto: CreateMovieDto = { title: getRandomMovieTitle() };

		const addMoviesSpy = jest.spyOn(service, 'addMovie');

		const movie = await service.addMovie(dto, testBasicUser);

		expect(movie).toBeTruthy();
		expect(movie.title).toEqual(dto.title);
		expect(addMoviesSpy).toHaveBeenCalledWith(dto, testBasicUser);
	});

	it('should throw `MovieAlreadyExistsException` to add an existing movie', async () => {
		const dto: CreateMovieDto = { title: getRandomMovieTitle() };

		const addMoviesSpy = jest.spyOn(service, 'addMovie');

		try {
			await service.addMovie(dto, testBasicUser);
			expect(addMoviesSpy).toHaveBeenCalledWith(dto, testBasicUser);

			await service.addMovie(dto, testBasicUser);
		} catch (error) {
			expect(error).toBeInstanceOf(MovieAlreadyExistsException);
		}
	});

	it('should throw `MovieAddLimitReachedException` to add more than 5 movie in a calendar month', async () => {
		const addMoviesSpy = jest.spyOn(service, 'addMovie');

		try {
			await service.addMovie({ title: moviesCollection[0].Title }, testBasicUser);
			await service.addMovie({ title: moviesCollection[1].Title }, testBasicUser);
			await service.addMovie({ title: moviesCollection[2].Title }, testBasicUser);
			await service.addMovie({ title: moviesCollection[3].Title }, testBasicUser);
			await service.addMovie({ title: moviesCollection[4].Title }, testBasicUser);
			await service.addMovie({ title: moviesCollection[5].Title }, testBasicUser);
			expect(addMoviesSpy).toHaveBeenCalledWith({ title: moviesCollection[0].Title }, testBasicUser);
		} catch (error) {
			expect(error).toBeInstanceOf(MovieAddLimitReachedException);
		}
	});

	it('should throw `MovieNotFoundException` with invalid movie title', async () => {
		const dto: CreateMovieDto = { title: 'dfdsfdfdsfdsfdsf' };

		const addMoviesSpy = jest.spyOn(service, 'addMovie');

		try {
			await service.addMovie(dto, testBasicUser);
			expect(addMoviesSpy).toHaveBeenCalledWith(dto, testBasicUser);
		} catch (error) {
			expect(error).toBeInstanceOf(MovieNotFoundException);
		}
	});

	it('should allow Premium user to add unlimited movie', async () => {
		const addMoviesSpy = jest.spyOn(service, 'addMovie');

		moviesCollection.forEach(async (item) => {
			await service.addMovie({ title: item.Title }, testPremiumUser);
			expect(addMoviesSpy).toHaveBeenCalledWith({ title: item.Title }, testPremiumUser);
		});
	});

	afterAll(async () => await module.close());
});
