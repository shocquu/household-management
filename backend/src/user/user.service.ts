import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserInput, UpdateUserInput } from 'src/types/graphql';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  create({ email, password, name, avatar_url }: CreateUserInput) {
    return this.prisma.user.create({
      data: { email, password, name, avatar: 'wad', login: 'wad' },
    });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true },
    });
  }

  update(id: number, { name }: UpdateUserInput) {
    return this.prisma.user.update({
      where: { id },
      data: { name },
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
