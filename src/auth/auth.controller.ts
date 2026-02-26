import {Controller, Post, Body, UseGuards, Req, Res, HttpException, HttpStatus} from "@nestjs/common";
import {AuthService} from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    @ApiOperation({ summary: 'Login user' })
    @ApiResponse({ status: 201, description: 'User logged in successfully.' })
    @ApiResponse({ status: 401, description: 'Invalid username or password.' })
    async login(@Body() loginDto: LoginDto, @Res() res) {

        if (!loginDto.username || !loginDto.password) {
            throw new HttpException('Username and password are required', HttpStatus.BAD_REQUEST);
        }

        const user = await this.authService.validateUser(loginDto.username, loginDto.password);
        const {access_token, refresh_token} = await this.authService.login(user);
        const response = {
            access_token,
            refresh_token,
            userName: loginDto.username,
            userId: user.id,
        };
        res.status(HttpStatus.CREATED).json(response);
    }
}