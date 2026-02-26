import {PrimaryGeneratedColumn, Column, Entity, ManyToOne, JoinColumn} from 'typeorm';
import {ApiProperty} from "@nestjs/swagger";
import {Expose} from "class-transformer";
import { User } from 'src/user/user.entity';

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    @ApiProperty({example: 1, description: 'The unique identifier of the comment'})
    @Expose()
    id!: number;

    @Column()
    @ApiProperty({example: 'Great exhibit!', description: 'The content of the comment'})
    @Expose()
    text!: string;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    @ApiProperty({example: '2024-06-01T12:00:00Z', description: 'The time the comment was created'})
    createdAt!: Date;

    @Expose()
    @ManyToOne(() => User, user => user.comments, { eager: true })
    @JoinColumn({ name: 'userId' })
    user!: User;

    @Column()
    @ApiProperty({example: 1, description: 'The ID of the user who made the comment'})
    userId!: number;

    @Column()
    @ApiProperty({example: 1, description: 'The ID of the exhibit the comment belongs to'})
    exhibitId!: number;
}