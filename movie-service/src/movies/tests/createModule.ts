import { Test } from '@nestjs/testing';
import { getModelToken } from 'nestjs-typegoose';
import { Types } from 'mongoose';

import { OmdbModule, OmdbService } from '@app/omdb';
import { BASIC_USER_MOVIE_ADD_LIMIT } from './../../common/constants/api.constant';
import { PaginationQueryDto } from './../../common/dto/pagination-query.dto';
import { MoviesController } from '../controllers/movies.controller';
import { MoviesService } from '../services/movies.service';
import { AuthRole, AuthUser } from '../../auth/interfaces/auth-user.interface';
import { MovieDto } from '../dto/movie.dto';
import { MovieAddLimitReachedException, MovieAlreadyExistsException, MovieNotFoundException } from '../exceptions';
import { CreateMovieDto } from '../dto/create-movie.dto';
import { moviesCollection } from './movies-collection.data';

const testModel = jest.fn();
const testService = jest.fn();

export class MoviesServiceMock {
	public movies: MovieDto[] = [];

	getMovies(query: PaginationQueryDto, user: AuthUser): MovieDto[] {
		query.setDefaults();

		let conditions = (item: MovieDto) => item.createdBy === user.userId;

		if (query.search) {
			const searchTerm = query.search.toLowerCase();

			conditions = (item: MovieDto) =>
				item.createdBy === user.userId &&
				(item.title.toLowerCase().includes(searchTerm) ||
					item.genre.toLowerCase().includes(searchTerm) ||
					item.director.toLowerCase().includes(searchTerm));
		}

		const result = this.movies.filter(conditions).slice((query.page - 1) * query.pageSize, query.page * query.pageSize);
		return result;
	}

	addMovie(dto: CreateMovieDto, user: AuthUser): MovieDto {
		const exceeded = this.isLimitReached(user);
		if (exceeded) throw new MovieAddLimitReachedException(user);

		const isExists = this.isMovieAlreadyAdded(dto.title, user.userId);
		if (isExists) throw new MovieAlreadyExistsException();

		const movie = this.fetchMovie(dto.title);
		if (!movie) throw new MovieNotFoundException();

		const item: MovieDto = {
			_id: new Types.ObjectId(),
			createdBy: user.userId,
			director: movie.Director,
			released: movie.Released,
			genre: movie.Genre,
			title: movie.Title,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		this.movies.push(item);

		return item;
	}

	private fetchMovie(title: string) {
		return moviesCollection.find((item) => item.Title.includes(title));
	}

	private isMovieAlreadyAdded(title: string, userId: number) {
		return this.movies.some((item) => item.title === title && item.createdBy === userId);
	}

	private getMoviesCountOfCurrentMonth(userId: number) {
		const today = new Date();
		const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
		const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
		endOfMonth.setHours(23, 59, 59, 999);

		return this.movies.filter((item) => {
			return item.createdBy === userId && item.createdAt >= startOfMonth && item.createdAt <= endOfMonth;
		}).length;
	}

	private isLimitReached(user: AuthUser) {
		if (user.role === AuthRole.Basic) {
			const count = this.getMoviesCountOfCurrentMonth(user.userId);
			if (count >= BASIC_USER_MOVIE_ADD_LIMIT) return true;
		}
		return false;
	}

	public static reset(instance: any) {
		if (instance?.movies) instance.movies = [];
	}
}

export const createMoviesTestingModule = async () => {
	const module = await Test.createTestingModule({
		controllers: [MoviesController],
		providers: [
			{
				provide: getModelToken('MovieEntity'),
				useValue: testModel,
			},
			{
				provide: OmdbService,
				useValue: testService,
			},
			MoviesService,
			{
				provide: MoviesService,
				useClass: MoviesServiceMock,
			},
		],
		imports: [OmdbModule.register({ apiKey: 'demo key' })],
	}).compile();

	const controller = module.get<MoviesController>(MoviesController);
	const service = module.get<MoviesService>(MoviesService);

	return { module, controller, service };
};
