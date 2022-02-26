import { Module } from '@nestjs/common';

import { OmdbModule } from '@app/omdb';
import { appConfig } from '../common';
import { MoviesController } from './controllers/movies.controller';
import { MoviesService } from './services/movies.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { MovieEntity } from './entities';

@Module({
  imports: [
    TypegooseModule.forFeature([MovieEntity]),
    OmdbModule.register({apiKey: appConfig.omdbApiKey})
  ],
  controllers: [MoviesController],
  providers: [MoviesService]
})
export class MoviesModule {}
