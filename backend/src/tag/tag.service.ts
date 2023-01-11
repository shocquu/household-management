import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTagInput, UpdateTagInput } from 'src/types/graphql';

@Injectable()
export class TagService {
  constructor(private prisma: PrismaService) {}

  create({ label, color }: CreateTagInput) {
    return this.prisma.tag.create({
      data: {
        label,
        color,
      },
    });
  }

  findAll() {
    return this.prisma.tag.findMany();
  }

  findOne(id: number) {
    return this.prisma.tag.findUnique({ where: { id } });
  }

  update(id: number, updateTagInput: UpdateTagInput) {
    return this.prisma.tag.update({
      where: { id },
      data: {
        id: updateTagInput.id,
        label: updateTagInput.label,
        color: updateTagInput.color,
        // tasks: {
        //   create: [{ id: 2 }],
        // },
        // tasks: undefined,
        // tasks: {
        //   connect: updateTagInput.
        // }
        // tasks: {
        //   deleteMany: {},
        //   create: [
        //     ...updateTagInput.tasks?.map((task) => ({
        //       task: { connect: task },
        //     })),
        //   ],
        // },
        // tasks: {
        //   deleteMany: {},
        //   // disconnect: true,
        // },
      },
      include: {
        tasks: true,
      },
    });
  }

  remove(id: number) {
    return this.prisma.tag.delete({ where: { id } });
  }

  async removeMany(ids: number[]) {
    const result = await this.prisma.tag.deleteMany({
      where: {
        id: { in: ids },
      },
    });
    return { count: result.count };
  }
}
