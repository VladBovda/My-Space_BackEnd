import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {User} from './user.entity';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async create(username: string, password: string): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 10);

        const existingUser = await this.userRepository.findOne({ where: { username } });
        if (existingUser) {
            throw new BadRequestException('User with this username already exists');
        }
        const user = this.userRepository.create({ username, password: hashedPassword });
        return this.userRepository.save(user);
    }

    async findById(id: number): Promise<User | undefined> {
        const user = await this.userRepository.findOne({ where: { id } });
        return user === null ? undefined : user;
    }

    async findByUsername(username: string): Promise<User | undefined> {
        const user = await this.userRepository.findOne({ where: { username } });
        return user === null ? undefined : user;
    }

    async refreshToken(id: number): Promise<User | undefined> {
        const user = await this.userRepository.findOne({ where: { id } });
        return user === null ? undefined : user;
    }
}
