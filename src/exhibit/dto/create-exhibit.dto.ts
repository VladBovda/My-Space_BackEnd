import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class CreateExhibitDto {
    @ApiProperty({example: 'Mona Lisa', description: 'The description of the exhibit'})
    @IsString()
    @IsNotEmpty()
    description!: string;
}
    