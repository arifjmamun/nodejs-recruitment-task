import { ApiProperty } from '@nestjs/swagger';
import { Prop } from '@typegoose/typegoose';
import { Expose } from 'class-transformer';
import { IsString, IsNumber } from 'class-validator';

import { DocumentWithTimeStamps, Model } from '@app/utils';

@Model('movies', true)
export class MovieEntity extends DocumentWithTimeStamps {
	@ApiProperty()
	@Expose()
	@IsString()
	@Prop()
	title: string;

	@ApiProperty()
	@Expose()
	@IsString()
	@Prop()
	released: string;

	@ApiProperty()
	@Expose()
	@IsString()
	@Prop()
	genre: string;

	@ApiProperty()
	@Expose()
	@IsString()
	@Prop()
	director: string;

	@ApiProperty({ description: 'The user ID' })
	@Expose()
	@IsNumber()
	@Prop()
	createdBy: number;
}
