import { PickType } from '@nestjs/swagger';

import { MovieEntity } from '../entities/movie.entity';

export class MovieDto extends PickType(MovieEntity, [
	'_id',
	'title',
	'genre',
	'released',
	'director',
	'createdBy',
	'updatedAt',
	'createdAt',
]) {}
