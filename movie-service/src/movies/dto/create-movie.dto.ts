import { PickType } from '@nestjs/swagger';

import { MovieEntity } from '../entities/movie.entity';

export class CreateMovieDto extends PickType(MovieEntity, ['title']) {}
