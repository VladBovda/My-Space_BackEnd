import {Controller, Post, Body, Get, Request, Query, NotFoundException, UseGuards, BadRequestException} from '@nestjs/common';
import {UserService} from "./user.service";
import {CreateUserDto} from "./dto/create-user.dto";
import {ApiOperation, ApiTags, ApiResponse, ApiQuery, ApiBearerAuth} from "@nestjs/swagger";
import { User } from './user.entity';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

const MinLoginLength = 4;
const MinPasswordLength = 4;

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private userService: UserService) { }

  @ApiOperation({ summary: 'New user registration' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    if (
      (!createUserDto.username || !createUserDto.password) ||
      (createUserDto.username.length < MinLoginLength) || (createUserDto.password.length < MinPasswordLength)
    ) {
      throw new BadRequestException(`The length of the username and password must be at least ${MinLoginLength} characters`);
    }

    const user = await this.userService.create(createUserDto.username, createUserDto.password);
    return plainToInstance(User, user, { excludeExtraneousValues: true });
  }

  @Get()
  @ApiOperation({ summary: 'Get user information by ID or username' })
  @ApiQuery({ name: 'id', required: false, description: 'User ID' })
  @ApiQuery({ name: 'username', required: false, description: 'Username' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUser(
    @Query('id') id?: number,
    @Query('username') username?: string,
  ) {
    if (!id && !username) {
      throw new BadRequestException('ID or username must be provided');
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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get current user information' })
  @ApiResponse({ status: 200, description: 'Current user information' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getMyProfile(@Request() req) {
    const user = await this.userService.findById(req.user.id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return plainToInstance(User, user, { excludeExtraneousValues: true });
  }
}

