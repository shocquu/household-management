import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskInput, UpdateTaskInput } from 'src/types/graphql';

@Injectable()
export class TaskService {
  constructor(
    private prisma: PrismaService, // private readonly tagService: TagService,
  ) {}

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

  async findAll() {
    const tasks = await this.prisma.task.findMany({
      include: {
        user: true,
        tags: { include: { tag: true } },
        comments: { include: { author: true } },
      },
    });

    return tasks.map((task) => ({
      ...task,
      tags: task.tags.map((tag) => tag.tag),
    }));
  }

  async findOne(id: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        user: true,
        tags: { include: { tag: true } },
        comments: { include: { author: true } },
      },
    });
    return { ...task, tags: task.tags.map((tag) => tag.tag) };
  }

  async update(id: number, updateTaskInput: UpdateTaskInput) {
    return this.prisma.task.update({
      where: { id },
      data: {
        ...updateTaskInput,
        dueDate: updateTaskInput?.dueDate
          ? new Date(updateTaskInput.dueDate).toISOString()
          : undefined,
        tags: updateTaskInput?.tags && {
          deleteMany: {},
          create: updateTaskInput?.tags?.map((tag) => ({
            tag: { connect: tag },
          })),
        },
      },
      include: {
        user: true,
        tags: true,
        comments: true,
      },
    });
  }

  remove(id: number) {
    return this.prisma.task.delete({
      where: { id },
      include: { user: true, tags: true },
    });
  }
}
