import { Req, UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from 'src/common/auth/auth.service';
import { JwtAuthGuard } from 'src/common/auth/jwt-auth.guard';
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

  @UseGuards(JwtAuthGuard)
  @Mutation('updateUser')
  update(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.userService.update(updateUserInput.id, updateUserInput);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @Mutation('removeUser')
  remove(@Args('id') id: number) {
    return this.userService.remove(id);
  }

  @Mutation('loginUser')
  login(@Args('loginUserInput') loginUserInput: LoginUserInput) {
    return this.userService.login(loginUserInput);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation('updatePassword')
  updatePassword(
    @Args('updatePasswordInput') updatePasswordInput: UpdatePasswordInput,
  ) {
    return this.userService.updatePassword(
      updatePasswordInput.id,
      updatePasswordInput,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Query('whoami')
  getCurrentUser(@CurrentUser() user: User) {
    return this.userService.findById(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Query('refresh')
  async refreshTokens(@CurrentUser() { id }: User) {
    const { refreshToken } = await this.userService.findById(id);
    return this.authService.refreshTokens(id, refreshToken);
  }
}
