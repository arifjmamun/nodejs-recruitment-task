import {
	BadRequestException,
	Inject,
	Injectable,
	InternalServerErrorException,
	UnauthorizedException,
} from '@nestjs/common';
import fetch, { Response } from 'node-fetch';

import { BASE_URL, OMDB_API_KEY } from './constants';
import { Movie } from './omdb.interface';

@Injectable()
export class OmdbService {
	constructor(@Inject(OMDB_API_KEY) private apiKey: string) {}

  public async getMovieByTitle(title: string) {
    const query = `t=${title}`;
    return await this.getMovie(query);
  }

  public async getMovieByIMDBId(imdbId: string) {
    const query = `i=${imdbId}`;
    return await this.getMovie(query);
  }

	private async getMovie(query: string) {
		const response = await fetch(`${BASE_URL}/?${query}&apikey=${this.apiKey}`, {
			headers: { 'content-type': 'application/json' },
			method: 'GET',
		});

		return await this.handleResponse(response);
	}

	private async handleResponse(response: Response) {
		const result = await response.json();

		switch (response.status) {
			case 200:
				if (result.Response === 'False') throw new BadRequestException(result?.Error);
				return result as Movie;
			case 401:
				throw new UnauthorizedException(result?.Error);
			default:
				throw new InternalServerErrorException(result?.Error);
		}
	}
}
