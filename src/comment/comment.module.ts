import { Module } from "@nestjs/common";
import {CommentController} from "./comment.controller";
import {CommentService} from "./comment.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../user/user.entity";
import { Exhibit } from "../exhibit/exhibit.entity";
import {Comment} from "./comment.entity";


@Module({
    imports: [TypeOrmModule.forFeature([Exhibit, User, Comment])],
    controllers: [CommentController],
    providers: [CommentService],
})
export class CommentModule {}