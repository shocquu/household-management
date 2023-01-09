import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { User } from 'src/types/graphql';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private jwtTokenService: JwtService,
  ) {}

  async validateUser(input: string, password: string): Promise<any> {
    const user = await this.userService.findUser(input);

    if (user)
      if (await bcrypt.compare(password, user.password)) {
        const { password: _, ...rest } = user;
        return rest;
      }

    return null;
  }

  async getTokens(userId: number, username: string) {
    const payload = { sub: userId, username };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtTokenService.signAsync(payload, {
        expiresIn: '60m',
      }),
      this.jwtTokenService.signAsync(payload, {
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.userService.findById(userId);

    if (!user || !user.refreshToken)
      throw new HttpException('Access denied', HttpStatus.UNAUTHORIZED);

    if (user.refreshToken !== refreshToken)
      throw new HttpException('Access denied', HttpStatus.UNAUTHORIZED);

    const tokens = await this.getTokens(user.id, user.username);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userService.update(userId, {
      id: userId,
      refreshToken: hashedRefreshToken,
    });
  }
}
