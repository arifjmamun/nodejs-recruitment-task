import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsOptional, IsNumber, IsString, Min, IsEnum } from 'class-validator';

enum Sort {
	ASC = 'asc',
	DESC = 'desc',
}

export class PaginationQueryDto {
	@ApiProperty({ required: false, default: 'updatedAt' })
	@Expose()
	@IsOptional()
	@IsString()
	sortBy: string;

	@ApiProperty({ enum: Sort, required: false, default: Sort.DESC })
	@Expose()
	@IsOptional()
	@IsEnum(Sort)
	sort: Sort;

	@ApiProperty({ required: false })
	@Expose()
	@IsOptional()
	@IsString()
	search?: string;

	@ApiProperty({ required: false, default: 1 })
	@Expose()
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	@Min(1)
	page: number;

	@ApiProperty({ required: false, default: 20 })
	@Expose()
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	@Min(1)
	pageSize: number;

	public setDefaults() {
		this.page = this.page || 1;
		this.pageSize = this.pageSize || 20;
		this.sort = this.sort || Sort.DESC;
		this.sortBy = this.sortBy || 'updatedAt';
	}
}
