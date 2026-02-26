import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsNumber } from "class-validator";

export class QueryExhibitDto {
    @ApiProperty({description: 'Pagination page number', required: false, default: 1})
    @IsOptional()
    @IsNumber()
    page?: number;

    @ApiProperty({description: 'Number of items per page', required: false, default: 10})
    @IsOptional()
    @IsNumber()
    limit?: number;
}