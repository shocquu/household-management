import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CreateUserDto, UpdatePasswordDto } from './user.dto';
// import { CreateUserInput, UpdateUserInput } from 'src/types/graphql';
import { UserService } from './user.service';

@Resolver('User')
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation('createUser')
  create(@Args('createUserInput') createUserInput: CreateUserDto) {
    return this.userService.create(createUserInput);
  }

  @Query('users')
  findAll() {
    return this.userService.findAll();
  }

  @Query('user')
  findOne(@Args('id') id: number) {
    return this.userService.findOne(id);
  }

  @Mutation('updateUser')
  update(@Args('updateUserInput') updateUserInput: any) {
    return this.userService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation('updatePassword')
  updatePassword(
    @Args('updateUserPassword') id: number,
    @Args('updateUserPassword') payload: UpdatePasswordDto,
  ) {
    return this.userService.updatePassword(id, payload);
  }

  @Mutation('removeUser')
  remove(@Args('id') id: number) {
    return this.userService.remove(id);
  }
}
