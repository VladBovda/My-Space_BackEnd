import { Module } from "@nestjs/common";
import {ExhibitController} from "./exhibit.controller";
import {ExhibitService} from "./exhibit.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../user/user.entity";
import { Exhibit } from "./exhibit.entity";
import {Comment} from "../comment/comment.entity";
import { NotificationsGateway } from "../notification/notifications-gateway";


@Module({
    imports: [TypeOrmModule.forFeature([Exhibit, User, Comment])],
    controllers: [ExhibitController],
    providers: [ExhibitService, NotificationsGateway],
})
export class ExhibitModule {}