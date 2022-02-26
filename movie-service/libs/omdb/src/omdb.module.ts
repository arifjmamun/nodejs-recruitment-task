import { DynamicModule, Module } from '@nestjs/common';

import { OMDB_API_KEY } from './constants';
import { OmdbService } from './omdb.service';

export type OmdbModuleOptions = {
	apiKey: string;
};

class APIKeyMissingError extends Error {
	constructor() {
		super('API Key is missing');
	}
}

@Module({})
export class OmdbModule {
	static register({ apiKey }: OmdbModuleOptions): DynamicModule {
		if (!apiKey) throw new APIKeyMissingError();

		return {
			module: OmdbModule,
			providers: [
				OmdbService,
				{
					provide: OMDB_API_KEY,
					useValue: apiKey,
				},
			],
			exports: [OmdbService],
		};
	}
}
