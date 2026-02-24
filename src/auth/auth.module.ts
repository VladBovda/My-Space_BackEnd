import { Module } from "@nestjs/common";
import {JwtModule} from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserModule } from "src/user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./jwt.strategy";
import {JwtAuthGuard} from "./jwt-auth.guard";

@Module({
    imports: [
        UserModule,
        PassportModule,
        JwtModule.register({
            secret: 'glorb',
            signOptions: { expiresIn: '30d' },
        }),
    ],
    providers: [AuthService, JwtStrategy, JwtAuthGuard],
    controllers: [AuthController],
    exports: [JwtAuthGuard],
})
export class AuthModule {}