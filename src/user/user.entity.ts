import {PrimaryGeneratedColumn, Column, Entity, OneToMany} from 'typeorm';
import {ApiProperty} from "@nestjs/swagger";
import {Expose} from "class-transformer";
import { Exhibit } from 'src/exhibit/exhibit.entity';
import { Comment } from 'src/comment/comment.entity';

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
    @ApiProperty({example: 'hashed_password', description: 'The password of the user'})
    password!: string;

    @Column({default: false})
    @ApiProperty({example: true, description: 'Indicates if the user is an admin'})
    isAdmin!: boolean;

    @OneToMany(() => Exhibit, exhibit => exhibit.user, { cascade: true }) 
    @ApiProperty({type: () => [Exhibit], description: 'The exhibits created by the user'})
    @Expose()
    exhibits!: Exhibit[];

    @OneToMany(() => Comment, comment => comment.user)
    @ApiProperty({type: () => [Comment], description: 'The comments made by the user'})
    @Expose()
    comments!: Comment[];
}