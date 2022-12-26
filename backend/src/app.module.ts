import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';
import { CommentModule } from './comment/comment.module';
import { TaskModule } from './task/task.module';
import { TagModule } from './tag/tag.module';

@Module({
  imports: [
    CommonModule,
    PrismaModule,
    UserModule,
    CommentModule,
    TaskModule,
    TagModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
