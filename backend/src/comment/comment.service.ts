import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentInput, UpdateCommentInput } from 'src/types/graphql';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  create({ authorId, taskId, message }: CreateCommentInput) {
    return this.prisma.comment.create({
      data: { authorId, taskId, message },
      include: { author: true },
    });
  }

  findAll() {
    return this.prisma.comment.findMany({ include: { author: true } });
  }

  findOne(id: number) {
    return this.prisma.comment.findUnique({
      where: { id },
      include: { author: true },
    });
  }

  update(id: number, { message }: UpdateCommentInput) {
    return this.prisma.comment.update({
      where: { id },
      data: {
        message,
      },
      include: { author: true },
    });
  }

  remove(id: number) {
    return this.prisma.comment.delete({
      where: { id },
      include: { author: true },
    });
  }
}
