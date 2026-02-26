import { Controller, Post, Body, Get, Delete, Param, Request, UseGuards, BadRequestException } from '@nestjs/common';
import { CommentService } from "./comment.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { ApiOperation, ApiTags, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { Comment } from "./comment.entity";
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('api/exhibits/:exhibitId/comments')
@ApiTags('comments')
export class CommentController {
    constructor(private commentService: CommentService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Create a new comment for an exhibit' })
    @ApiResponse({ status: 201, description: 'The comment has been successfully created.', type: Comment })
    async create(
        @Param('exhibitId') exhibitId: number,
        @Body() createCommentDto: CreateCommentDto,
        @Request() req) {

        if (!createCommentDto.text || !createCommentDto.text.length) {
            throw new BadRequestException('Content is required');
        }

        const comment = await this.commentService.create(
            exhibitId,
            createCommentDto.text,
            req.user.id
        );
        return plainToInstance(Comment, comment, { excludeExtraneousValues: true });
    }

    @Get()
    @ApiOperation({ summary: 'Get all comments for an exhibit' })
    @ApiResponse({ status: 200, description: 'List of comments for the exhibit.', type: [Comment] })
    async findAll(@Param('exhibitId') exhibitId: number) {
        const comments = await this.commentService.findAll(exhibitId);
        return plainToInstance(Comment, comments, { excludeExtraneousValues: true });
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':commentId')
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Delete a comment' })
    @ApiResponse({ status: 200, description: 'The comment has been successfully deleted.' })
    async remove(@Param('exhibitId') exhibitId: number, @Param('commentId') commentId: number, @Request() req) {
        await this.commentService.remove(exhibitId, commentId, req.user.id);
        return { message: 'Comment deleted successfully' };
    }
}