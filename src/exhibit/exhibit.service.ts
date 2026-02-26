import { Injectable, ForbiddenException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { Multer } from 'multer';
import { Exhibit } from './exhibit.entity';
import { User } from 'src/user/user.entity';
import { PaginatedExhibits } from "./interfaces/PaginatedExhibits.interface";
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';



@Injectable()
export class ExhibitService {
    constructor(
        @InjectRepository(Exhibit)
        private exhibitRepository: Repository<Exhibit>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async create(file: Multer.File, description: string, userId: number): Promise<Exhibit> {
        const uploadDir = path.join(__dirname, '../../..', 'uploads');

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }

        const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
        const filePath = path.join(uploadDir, uniqueFilename);

        try {
            fs.writeFileSync(filePath, file.buffer);
        } catch (error) {
            throw new InternalServerErrorException('Failed to save the image file');
        }


        const exhibit = this.exhibitRepository.create({
            description,
            imageUrl: `/static/${uniqueFilename}`,
            userId
        });
        return this.exhibitRepository.save(exhibit);
    }

    private removeFile(filePath: string): void {
        const fileName = path.basename(filePath);
        const removeFilePath = path.join(__dirname, '../../..', 'uploads', fileName);

        if (!fs.existsSync(removeFilePath)) {
            return;
        }

        try {
            fs.unlinkSync(removeFilePath);
        } catch {
            throw new InternalServerErrorException('Failed to delete the image file');
        }
    }

    async findAll(page = 1, limit = 10): Promise<PaginatedExhibits> {
        if (page < 1 || !page) {
            page = 1;
        }
        if (limit < 1 || !limit) {
            limit = 10;
        }
        const [result, total] = await this.exhibitRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        return {
            data: result,
            total,
            page,
            lastPage: Math.ceil(total / limit),
        };
    }

    async findOne(id: number): Promise<Exhibit> {
        const exhibit = await this.exhibitRepository.findOne({ where: { id } });
        if (!exhibit) {
            throw new NotFoundException(`Exhibit with ID ${id} not found`);
        }
        return exhibit;
    }

    async findByUserId(userId: number, page = 1, limit = 10): Promise<PaginatedExhibits> {
        if (page < 1 || !page) {
            page = 1;
        }
        if (limit < 1 || !limit) {
            limit = 10;
        }

        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        const [result, total] = await this.exhibitRepository.findAndCount({
            where: { userId },
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'DESC' },
        });

        return {
            data: result,
            total,
            page,
            lastPage: Math.ceil(total / limit),
        };
    }
    async remove(id: number, userId: number): Promise<void> {
        const exhibit = await this.exhibitRepository.findOne({ where: { id } });
        if (!exhibit) {
            throw new NotFoundException(`Exhibit with ID ${id} not found`);
        }

        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        if (user?.isAdmin) {
            await this.exhibitRepository.remove(exhibit);
            this.removeFile(exhibit.imageUrl);
            return;
        }

        if (exhibit.userId !== userId) {
            throw new ForbiddenException('You do not have permission to delete this exhibit');
        }
        await this.exhibitRepository.remove(exhibit);
        this.removeFile(exhibit.imageUrl);
    }
};
