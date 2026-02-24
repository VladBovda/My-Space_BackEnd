import {Injectable, UnauthorizedException} from '@nestjs/common';
import {UserService} from "src/user/user.service";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';
import {User} from "src/user/user.entity";
import { ref } from 'process';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) {}

    async validateUser(username: string, password: string): Promise<User> {
        const user = await this.userService.findByUsername(username);

        if (!user) {
            throw new UnauthorizedException('Invalid username or password');
        }

        if (user && await bcrypt.compare(password, user.password)) {
            return user;
        }
        throw new UnauthorizedException('Invalid username or password');
    }

    async login(user: User) {
        const payload = { username: user.username, sub: user.id };
        const acessToken = this.jwtService.sign(payload, { expiresIn: '30d' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
        return {
            access_token: acessToken,
            refresh_token: refreshToken,
        };

    }

    async refreshToken(refreshToken: string) {
        const isValid = await this.ValidateRefreshToken(refreshToken);

        if (!isValid) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const newAccessToken = this.jwtService.sign({ username: isValid.username, sub: isValid.id }, { expiresIn: '30d' });
        const newRefreshToken = this.jwtService.sign({ username: isValid.username, sub: isValid.id }, { expiresIn: '7d' });

        return {
            access_token: newAccessToken,
            refresh_token: newRefreshToken,
        };
    }

    private async ValidateRefreshToken(refreshToken: string) {
        const payload = this.jwtService.decode.verify(refreshToken);

        if (!payload) {
            return null;
        }
        return this.userService.findByUsername(payload.username); 
    }
}