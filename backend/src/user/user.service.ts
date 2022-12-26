import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateUserInput,
  LoginUserInput,
  UpdateUserInput,
} from 'src/types/graphql';
import { AuthService } from 'src/common/auth/auth.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async login({ email, password }: LoginUserInput) {
    const user = await this.authService.validate(email, password);

    if (!user)
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);

    return this.authService.generateCredentials(user);
  }

  async create({ email, password, name, avatar_url }: CreateUserInput) {
    const doesExist = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (doesExist)
      throw new HttpException(
        'User with this email already exists',
        HttpStatus.CONFLICT,
      );

    const hashed = await bcrypt.hash(password, 10);

    return this.prisma.user.create({
      data: { email, password: hashed, name, avatar_url },
      include: {
        tasks: {
          include: {
            tags: true,
            _count: {
              // select: { comments: true },
            },
          },
        },
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      include: {
        tasks: {
          include: {
            tags: true,
            comments: true,
            // _count: {
            //   select: { comments: true },
            // },
          },
        },
      },
    });
  }

  findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        tasks: {
          include: {
            tags: true,
            _count: {
              select: { comments: true },
            },
          },
        },
      },
    });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        tasks: {
          include: {
            tags: true,
            _count: {
              select: { comments: true },
            },
          },
        },
      },
    });
  }

  update(id: number, { name }: UpdateUserInput) {
    return this.prisma.user.update({
      where: { id },
      data: { name },
      include: { tasks: true },
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({
      where: { id },
      include: { tasks: true },
    });
  }
}
