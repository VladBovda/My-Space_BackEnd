import { Controller, Post, Body, Get, Delete, Param, Request, UseGuards, Query, NotFoundException, BadRequestException, UploadedFile, UseInterceptors, ParseIntPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Multer } from 'multer';
import { ExhibitService } from "./exhibit.service";
import { NotificationsGateway } from "../notification/notifications-gateway";
import { CreateExhibitDto } from "./dto/create-exhibit.dto";
import { ApiOperation, ApiTags, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from "@nestjs/swagger";
import { Exhibit } from "./exhibit.entity";
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { QueryExhibitDto } from './dto/query-exhibit.dto';

@Controller('api/exhibits')
@ApiTags('exhibits')
export class ExhibitController {
    constructor(private exhibitService: ExhibitService, private readonly notificationService: NotificationsGateway) { }


    @UseGuards(JwtAuthGuard)
    @Post()
    @UseInterceptors(FileInterceptor('image'))
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Create a new exhibit' })
    @ApiResponse({ status: 201, description: 'The exhibit has been successfully created.', type: Exhibit })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                description: { type: 'string', example: 'A portrait painting by Leonardo da Vinci' },
                image: { type: 'string', format: 'binary' },
            },
        },
    })
    async create(
        @UploadedFile() file: Multer.File,
        @Body() createExhibitDto: CreateExhibitDto,
        @Request() req) {

        if (!file) {
            throw new BadRequestException('Image file is required');
        }
        if (!file.mimetype.match(/^image\/(jpeg|png|gif)$/)) {
            throw new BadRequestException('Only JPEG, PNG, and GIF images are allowed');
        }
        if (file.size > 5 * 1024 * 1024) {
            throw new BadRequestException('Image file size must be less than 5MB');
        }
        if (!createExhibitDto.description || !createExhibitDto.description.length) {
            throw new BadRequestException('Description is required');
        }

        const exhibit = await this.exhibitService.create(
            file,
            createExhibitDto.description,
            req.user.id
        );

        this.notificationService.notifyNewExhibit({
            description: createExhibitDto.description,
            user: req.user.username,
        });
        return plainToInstance(Exhibit, exhibit, { excludeExtraneousValues: true });
    }

    @Get()
    @ApiOperation({ summary: 'Get all exhibits' })
    @ApiResponse({ status: 200, description: 'List of exhibits', type: [Exhibit] })
    async findAll(@Query() query: QueryExhibitDto) {
        const { page = 1, limit = 10 } = query;
        const exhibits = await this.exhibitService.findAll(page, limit);
        return {
            ...exhibits,
            data: plainToInstance(Exhibit, exhibits.data),
            excludeExtraneousValues: true,
        };
    }


    @Get('post/:id')
    @ApiOperation({ summary: 'Get an exhibit by ID' })
    @ApiResponse({ status: 200, description: 'The exhibit', type: Exhibit })
    @ApiResponse({ status: 404, description: 'Exhibit not found' })
    async findOne(@Param('id') id: number) {
        const exhibit = await this.exhibitService.findOne(id);
        if (!exhibit) {
            throw new NotFoundException('Exhibit not found');
        }
        return plainToInstance(Exhibit, exhibit, { excludeExtraneousValues: true });
    }

    @Get('my-posts')
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Get exhibits created by the authenticated user' })
    @ApiResponse({ status: 200, description: 'List of exhibits created by the user', type: [Exhibit] })
    @UseGuards(JwtAuthGuard)
    async findMyPosts(@Request() req, @Query() query: QueryExhibitDto) {
        const { page = 1, limit = 10 } = query;
        const exhibits = await this.exhibitService.findByUserId(req.user.id, page, limit);
        return {
            ...exhibits,
            data: plainToInstance(Exhibit, exhibits.data, { excludeExtraneousValues: true }),
        }
    }

    @Delete(':id')
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Delete an exhibit by ID' })
    @ApiResponse({ status: 200, description: 'The exhibit has been successfully deleted.' })
    @ApiResponse({ status: 404, description: 'Exhibit not found' })
    @UseGuards(JwtAuthGuard)
    async remove(@Param('id') id: number, @Request() req) {
        return this.exhibitService.remove(id, req.user.id);
    }
}
