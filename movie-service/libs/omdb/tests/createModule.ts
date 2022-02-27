import { Test } from '@nestjs/testing';

import { OMDB_API_KEY } from './../src/constants';
import { OmdbModule, OmdbService } from '../src';

const apiKey = process.env.OMDB_API_KEY as string;

export const createOmdbTestingModule = async () => {
	const module = await Test.createTestingModule({
		providers: [
			OmdbService,
			{
				provide: OMDB_API_KEY,
				useValue: apiKey,
			},
		],
		imports: [OmdbModule.register({ apiKey })],
	}).compile();

	const service = module.get<OmdbService>(OmdbService);

	return { module, service };
};
