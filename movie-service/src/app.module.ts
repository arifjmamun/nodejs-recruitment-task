import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { appConfig } from './common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoviesModule } from './movies/movies.module';
import { AuthModule } from './auth/auth.module';

@Module({
	imports: [TypegooseModule.forRoot(appConfig.mongoURL), MoviesModule, AuthModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
