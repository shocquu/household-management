import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
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

  async getTokens(userId: number, username: string, remember?: boolean) {
    const payload = { sub: userId, username };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtTokenService.signAsync(payload, {
        expiresIn: '1m',
      }),
      this.jwtTokenService.signAsync(payload, {
        expiresIn: remember ? '30d' : '7d',
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

    const tokenMatches = await bcrypt.compare(refreshToken, user.refreshToken);

    if (!tokenMatches)
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
