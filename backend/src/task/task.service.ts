import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskInput, UpdateTaskInput } from 'src/types/graphql';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  create({ userId, title, description }: CreateTaskInput) {
    return this.prisma.task.create({
      data: {
        title,
        user: { connect: { id: userId } },
        description: description != null ? description : undefined,
      },
      include: { user: true, tags: true },
    });
  }

  findAll() {
    return this.prisma.task.findMany({
      include: {
        user: true,
        tags: true,
        comments: { include: { author: true } },
      },
    });
  }

  findOne(id: number) {
    return this.prisma.task.findUnique({
      where: { id },
      include: {
        user: true,
        tags: true,
        comments: { include: { author: true } },
      },
    });
  }

  update(id: number, { userId, title, description }: UpdateTaskInput) {
    return this.prisma.task.update({
      where: { id },
      data: { userId, title, description },
      include: { user: true, tags: true, comments: true },
    });
  }

  remove(id: number) {
    return this.prisma.task.delete({
      where: { id },
      include: { user: true, tags: true },
    });
  }
}
