import { ApiProperty } from "@nestjs/swagger";
import {MinLength} from "class-validator";

export class CreateUserDto {
    @ApiProperty({example: 'john_doe', description: 'The name of the user'})
    @MinLength(6, { message: 'Username must be at least 6 characters long' })
    username!: string;

    @ApiProperty({example: 'password123', description: 'The password of the user'})
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password!: string;
}