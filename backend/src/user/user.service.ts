import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateUserInput,
  LoginUserInput,
  UpdatePasswordInput,
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
    const user = await this.authService.validateUser(email, password);

    if (!user)
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);

    return this.authService.generateCredentials(user);
  }

  async create({
    email,
    password,
    username,
    displayName,
    avatarUrl,
  }: CreateUserInput) {
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
      data: { email, password: hashed, username, displayName, avatarUrl },
      include: {
        tasks: {
          include: {
            tags: true,
          },
        },
      },
    });
  }

  async update(
    id: number,
    { email, displayName, password, avatarUrl }: UpdateUserInput,
  ) {
    const hashed = await bcrypt.hash(password, 10);

    return this.prisma.user.update({
      where: { id },
      data: { email, displayName, password: hashed, avatarUrl },
      include: { tasks: true },
    });
  }

  async updatePassword(
    id: number,
    { oldPassword, newPassword }: UpdatePasswordInput,
  ) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const isValidPassword = await bcrypt.compare(oldPassword, user.password);

    if (!isValidPassword)
      throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);

    const hashed = await bcrypt.hash(newPassword, 10);

    return this.prisma.user.update({
      where: { id },
      data: { password: hashed },
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      include: {
        tasks: {
          include: {
            tags: true,
            comments: true,
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

  remove(id: number) {
    return this.prisma.user.delete({
      where: { id },
      include: { tasks: true },
    });
  }
}
