import { forwardRef, Inject, Injectable } from '@nestjs/common';
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

  async validate(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);

    if (user)
      if (await bcrypt.compare(password, user.password)) {
        const { password: _, ...rest } = user;
        return rest;
      }

    return null;
  }

  async generateCredentials(user: User) {
    return {
      user_id: user.id,
      access_token: this.jwtTokenService.sign(user),
    };
  }
}
