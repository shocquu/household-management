import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdatePasswordDto } from './user.dto';

interface FormatLogin extends Partial<User> {
  login: string;
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(userDto: CreateUserDto): Promise<any> {
    const user = await this.prisma.user.findFirst({
      where: { login: userDto.login },
    });

    if (user)
      throw new HttpException('user_already_exists', HttpStatus.CONFLICT);

    return await this.prisma.user.create({
      data: {
        ...userDto,
        role: Role.USER,
        password: await hash(userDto.password, 12),
      },
    });
  }

  async updatePassword(payload: UpdatePasswordDto, id: number): Promise<User> {
    const foundUser = await this.prisma.user.findUnique({ where: { id } });
    const isCorrect = await compare(payload.old_password, foundUser.password);

    if (!foundUser || !isCorrect)
      throw new HttpException('invalid_credentials', HttpStatus.UNAUTHORIZED);

    return await this.prisma.user.update({
      where: { id },
      data: { password: await hash(payload.new_password, 12) },
    });
  }
}
