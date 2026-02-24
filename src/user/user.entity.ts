import {PrimaryGeneratedColumn, Column, Entity} from 'typeorm';
import {ApiProperty} from "@nestjs/swagger";
import {Expose} from "class-transformer";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    @ApiProperty({example: 1, description: 'The unique identifier of the user'})
    @Expose()
    id!: number;

    @Column({unique: true})
    @ApiProperty({example: 'john_doe', description: 'The name of the user'})
    @Expose()
    username!: string;

    @Column()
    @ApiProperty({example: 'password123', description: 'The password of the user'})
    password!: string;

    @Column({default: false})
    @ApiProperty({example: true, description: 'Indicates if the user is an admin'})
    isAdmin!: boolean;
}