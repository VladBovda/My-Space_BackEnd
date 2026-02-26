import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsNumber } from "class-validator";

export class CreateCommentDto {
    @ApiProperty({example: 'Great exhibit!', description: 'The content of the comment'})
    @IsString()
    @IsNotEmpty()
    text!: string;
}