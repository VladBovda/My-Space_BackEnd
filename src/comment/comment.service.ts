import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exhibit } from '../exhibit/exhibit.entity';
import { User } from '../user/user.entity';
import { Comment } from './comment.entity';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private commentRepository: Repository<Comment>,
        @InjectRepository(Exhibit)
        private exhibitRepository: Repository<Exhibit>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async create(exhibitId: number, text: string, userId: number): Promise<Comment> {
        const exhibit = await this.exhibitRepository.findOne({ where: { id: exhibitId } });
        if (!exhibit) {
            throw new NotFoundException('Exhibit not found');
        }

        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const comment = this.commentRepository.create({
            text,
            exhibitId,
            userId
        });
        return this.commentRepository.save(comment);
    }

    async findAll(exhibitId: number): Promise<Comment[]> {
        const exhibit = await this.exhibitRepository.findOne({ where: { id: exhibitId } });
        if (!exhibit) {
            throw new NotFoundException('Exhibit not found');
        }

        return this.commentRepository.find({
            where: { exhibitId },
            order: { createdAt: 'DESC' },
        });
    }

    async remove(exhibitId: number, commentId: number, userId: number): Promise<void> {
        const exhibit = await this.exhibitRepository.findOne({ where: { id: exhibitId } });
        if (!exhibit) {
            throw new NotFoundException('Exhibit not found');
        }

        const comment = await this.commentRepository.findOne({ where: { id: commentId, exhibitId } });
        if (!comment) {
            throw new NotFoundException('Comment not found');
        }

        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (comment.userId !== userId && !user.isAdmin) {
            throw new ForbiddenException('You can only delete your own comments');
        }

        await this.commentRepository.delete(comment.id);
    }
}