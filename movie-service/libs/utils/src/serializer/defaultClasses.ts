import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Types } from 'mongoose';

import { ObjectID } from './ObjectID.decorator';

export class Document {
	@ApiProperty({ name: 'id', type: String })
	@ObjectID()
	@Expose({ name: 'id' })
	_id: Types.ObjectId;
}

export class DocumentWithTimeStamps extends Document {
	@Expose({ name: 'createdAt' })
	public createdAt: Date;

	@Expose({ name: 'updatedAt' })
	public updatedAt: Date;
}
