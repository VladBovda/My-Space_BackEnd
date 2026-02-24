import {Controller, Post, Body, Get, Request, Query, NotFoundException, UseGuards, BadRequestException} from '@nestjs/common';
import {UserService} from "./user.service";
import {CreateUserDto} from "./dto/create-user.dto";
import {ApiOperation, ApiTags, ApiResponse} from "@nestjs/swagger";
import { User } from './user.entity';
import { plainToInstance } from 'class-transformer';

@Controller('users')
@ApiTags('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: 201, description: 'The user has been successfully created.', type: User })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        if (!createUserDto.username || !createUserDto.password) {
            throw new BadRequestException('Username and password are required');
        }
        const user = this.userService.create(createUserDto.username, createUserDto.password);
        return plainToInstance(User, user, { excludeExtraneousValues: true }); 
    }

    @ApiOperation({ summary: 'Get user by ID' })
    @ApiResponse({ status: 200, description: 'The user profile has been successfully retrieved.', type: User })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    //@UseGuards(AuthGuard('jwt'))
    @Get('profile')
    async getProfile(@Query('id') id?: number, @Query('username') username?: string) {
        if (!id && !username) {
            throw new NotFoundException('ID or username must be provided');
        }

        const user = id ? 
            await this.userService.findById(id) : 
            await this.userService.findByUsername(username!);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return plainToInstance(User, user, { excludeExtraneousValues: true });
    }

    @Get('my-profile')
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({ status: 200, description: 'The user profile has been successfully retrieved.', type: User })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    //@UseGuards(AuthGuard('jwt'))
    async getCurrentUser(@Request() req) {
        const user = await this.userService.findById(req.user.id as number);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return plainToInstance(User, user, { excludeExtraneousValues: true });
    }
}

