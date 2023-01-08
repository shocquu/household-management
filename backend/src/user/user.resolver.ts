import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
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
  constructor(private readonly userService: UserService) {}

  @Mutation('createUser')
  create(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.create(createUserInput);
  }

  @Query('users')
  @Roles(Role.ADMIN)
  findAll() {
    return this.userService.findAll();
  }

  @Query('user')
  findOne(@Args('id') id: number) {
    return this.userService.findById(id);
  }

  @Query('whoami')
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@CurrentUser() user: User) {
    return this.userService.findById(user.id);
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
}
