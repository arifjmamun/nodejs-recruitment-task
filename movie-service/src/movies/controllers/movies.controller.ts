import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { ApiCreatedResponse, ApiOkResponse, Serialize, User } from '@app/utils';
import { PaginationQueryDto } from '../../common';
import { JwtAuthGuard } from '../../auth/guards';
import { CreateMovieDto, MovieDto } from '../dto';
import { MoviesService } from '../services/movies.service';
import { AuthUser } from './../../auth/interfaces';

@ApiTags('Movies')
@ApiBearerAuth()
@Serialize()
@UseGuards(JwtAuthGuard)
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

	@ApiCreatedResponse({ type: MovieDto, description: 'Add new movie' })
	@Post()
	async addMovie(@Body() dto: CreateMovieDto, @User() user: AuthUser) {
		return await this.moviesService.addMovie(dto, user);
	}

  @ApiOkResponse({ type: [MovieDto], description: 'Get all movies by pagination' })
	@Get()
	async getAll(@Query() query: PaginationQueryDto, @User() user: AuthUser) {
		return this.moviesService.getMovies(query, user);
	}
}
