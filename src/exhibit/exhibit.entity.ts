import {PrimaryGeneratedColumn, Column, Entity, ManyToOne, JoinColumn} from 'typeorm';
import {ApiProperty} from "@nestjs/swagger";
import {Expose} from "class-transformer";
import { User } from 'src/user/user.entity';

@Entity()
export class Exhibit {
    @PrimaryGeneratedColumn()
    @ApiProperty({example: 1, description: 'The unique identifier of the exhibit'})
    @Expose()
    id!: number;

    @Column()
    @ApiProperty({example: 'A portrait painting by Leonardo da Vinci', description: 'The description of the exhibit'})
    @Expose()
    description!: string;

    @Column()
    @ApiProperty({example: 'https://example.com/mona-lisa.jpg', description: 'The image URL of the exhibit'})
    @Expose()
    imageUrl!: string;
    
    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    @ApiProperty({example: '2024-06-01T12:00:00Z', description: 'The time the exhibit was created'})
    createdAt!: Date;

    @Expose()
    @ManyToOne(() => User, user => user.exhibits, { eager: true })
    @JoinColumn({ name: 'userId' })
    user!: User;

    @Column()
    @ApiProperty({example: 1, description: 'The ID of the user who created the exhibit'})
    userId!: number;
}
    