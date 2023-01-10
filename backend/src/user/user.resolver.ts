import { Req, UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Request } from 'express';
import { AuthService } from 'src/common/auth/auth.service';
import { AccessTokenGuard } from 'src/common/auth/guards/accessToken.guard';
import { RefreshTokenGuard } from 'src/common/auth/guards/refreshToken.guard';
import { Roles } from 'src/role/role.decorator';
import {
  User,
  Role,
  CreateUserInput,
  LoginUserInput,
  UpdateUserInput,
  UpdatePasswordInput,
} from 'src/types/graphql';
import { CurrentUser } from './user.decorator';
import { UserService } from './user.service';

@Resolver('User')
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Mutation('createUser')
  create(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.create(createUserInput);
  }

  @Roles(Role.ADMIN)
  @Query('users')
  findAll() {
    return this.userService.findAll();
  }

  @Query('user')
  findOne(@Args('id') id: number) {
    return this.userService.findById(id);
  }

  @UseGuards(AccessTokenGuard)
  @Mutation('updateUser')
  update(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.userService.update(updateUserInput.id, updateUserInput);
  }

  @UseGuards(AccessTokenGuard)
  @Roles(Role.ADMIN)
  @Mutation('removeUser')
  remove(@Args('id') id: number) {
    return this.userService.remove(id);
  }

  @Mutation('loginUser')
  login(@Args('loginUserInput') loginUserInput: LoginUserInput) {
    return this.userService.login(loginUserInput);
  }

  @UseGuards(AccessTokenGuard)
  @Query('logoutUser')
  logout(@CurrentUser() user) {
    return this.userService.logout(user.sub);
  }

  @UseGuards(RefreshTokenGuard)
  @Query('refresh')
  refreshTokens(@CurrentUser() user) {
    const { sub, refreshToken } = user;
    return this.authService.refreshTokens(sub, refreshToken);
  }

  @UseGuards(AccessTokenGuard)
  @Mutation('updatePassword')
  updatePassword(
    @Args('updatePasswordInput') updatePasswordInput: UpdatePasswordInput,
  ) {
    return this.userService.updatePassword(
      updatePasswordInput.id,
      updatePasswordInput,
    );
  }

  @UseGuards(AccessTokenGuard)
  @Query('whoami')
  getCurrentUser(@CurrentUser() user: Partial<User> & { sub: number }) {
    return this.userService.findById(user.sub);
  }
}
