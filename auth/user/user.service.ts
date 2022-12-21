import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import { PrismaService } from '../../backend/src/prisma/prisma.service';
import { CreateUserDto, LoginUserDto, UpdatePasswordDto } from './user.dto';

interface FormatLogin extends Partial<User> {
    login: string;
}

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async create(userDto: any): Promise<any> {
        const user = await this.prisma.user.findFirst({
            where: { login: userDto.login },
        });

        if (user) throw new HttpException('user_already_exists', HttpStatus.CONFLICT);

        return await this.prisma.user.create({
            data: { ...userDto },
            // role: Role.USER,
            // password: await hash(userDto.password, 12),
        });
    }

    async findOne(id: number) {
        return this.prisma.user.findUnique({
            where: { id },
            select: { name: true, id: true },
        });
    }

    async findByCredentials({ login, password }: LoginUserDto): Promise<FormatLogin> {
        const user = await this.prisma.user.findFirst({
            where: { login },
        });

        if (!user) throw new HttpException('invalid_credentials', HttpStatus.UNAUTHORIZED);

        const isCorrect = await compare(password, user.password);

        if (!isCorrect) throw new HttpException('invalid_credentials', HttpStatus.UNAUTHORIZED);

        const { password: _, ...rest } = user;

        return rest;
    }

    async findByLogin({ login }: { login: string }): Promise<any> {
        return await this.prisma.user.findFirst({
            where: { login },
        });
    }

    async findAll() {
        return this.prisma.user.findMany();
    }

    async updatePassword(id: number, payload: UpdatePasswordDto): Promise<User> {
        const foundUser = await this.prisma.user.findUnique({ where: { id } });
        const isCorrect = await compare(payload.old_password, foundUser.password);

        if (!foundUser || !isCorrect) throw new HttpException('invalid_credentials', HttpStatus.UNAUTHORIZED);

        return await this.prisma.user.update({
            where: { id },
            data: { password: await hash(payload.new_password, 12) },
        });
    }

    async update(id: number, { name }: any) {
        return this.prisma.user.update({
            where: { id },
            data: { name },
        });
    }

    async remove(id: number) {
        return this.prisma.user.delete({
            where: { id },
        });
    }
}
