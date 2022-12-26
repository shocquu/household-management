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

  update(id: number, { label, color }: UpdateTagInput) {
    return this.prisma.tag.update({
      where: { id },
      data: {
        label,
        color,
      },
    });
  }

  remove(id: number) {
    return this.prisma.tag.delete({ where: { id } });
  }
}
