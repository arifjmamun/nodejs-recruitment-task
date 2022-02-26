import { plainToInstance } from 'class-transformer';
import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { FilterQuery } from 'mongoose';

import { OmdbService } from '@app/omdb';
import { MovieAddLimitReachedException, MovieAlreadyExistsException, MovieNotFoundException } from '../exceptions';
import { BASIC_USER_MOVIE_ADD_LIMIT, classTransformOptions, PaginationQueryDto } from '../../common';
import { AuthRole, AuthUser } from '../../auth/interfaces';
import { CreateMovieDto, MovieDto } from '../dto';
import { MovieEntity } from '../entities';

@Injectable()
export class MoviesService {
	constructor(
		@InjectModel(MovieEntity) private movieEntity: ReturnModelType<typeof MovieEntity>,
		private readonly omdbService: OmdbService,
	) {}

	public async getMovies(query: PaginationQueryDto, user: AuthUser) {
		query.setDefaults();

		const searchPattern = `.*${query.search}.*`;
		let conditions: FilterQuery<MovieEntity> = {
			createdBy: user.userId,
		};

		if (query.search) {
			conditions = {
				...conditions,
				$or: [
					{ title: { $regex: searchPattern, $options: 'i' } },
					{ genre: { $regex: searchPattern, $options: 'i' } },
					{ director: { $regex: searchPattern, $options: 'i' } },
				],
			};
		}

		const docs = await this.movieEntity
			.find(conditions)
			.sort({ [query.sortBy]: query.sort })
			.limit(query.pageSize)
			.skip((query.page - 1) * query.pageSize);

		return plainToInstance(MovieDto, docs, classTransformOptions);
	}

	public async addMovie(dto: CreateMovieDto, user: AuthUser) {
		const exceeded = await this.isLimitReached(user);
		if (exceeded) throw new MovieAddLimitReachedException(user);

		const isExists = await this.isMovieAlreadyAdded(dto.title, user.userId);
		if (isExists) throw new MovieAlreadyExistsException();

		const movie = await this.fetchMovie(dto.title);
		if (!movie) throw new MovieNotFoundException();

		const doc = await this.movieEntity.create({
			title: movie.Title,
			genre: movie.Genre,
			director: movie.Director,
			released: movie.Released,
			createdBy: user.userId,
		});

		return plainToInstance(MovieDto, doc, classTransformOptions);
	}

	private async fetchMovie(title: string) {
		return this.omdbService.getMovieByTitle(title);
	}

	private async isMovieAlreadyAdded(title: string, userId: number) {
		const count = await this.movieEntity.count({ title, createdBy: userId });
		return !!count;
	}

	private async getMoviesCountOfCurrentMonth(userId: number) {
		const today = new Date();
		const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
		const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
		endOfMonth.setHours(23, 59, 59, 999);

		return await this.movieEntity.count({
			createdBy: userId,
			$and: [{ createdAt: { $gte: startOfMonth } }, { createdAt: { $lte: endOfMonth } }],
		});
	}

	private async isLimitReached(user: AuthUser) {
		if (user.role === AuthRole.Basic) {
			const count = await this.getMoviesCountOfCurrentMonth(user.userId);
			if (count >= BASIC_USER_MOVIE_ADD_LIMIT) return true;
		}
		return false;
	}
}
