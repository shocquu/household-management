import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Roles } from 'src/role/role.decorator';
import { CreateTaskInput, Role, UpdateTaskInput } from 'src/types/graphql';
import { TaskService } from './task.service';

@Resolver('Task')
export class TaskResolver {
  constructor(private readonly taskService: TaskService) {}

  @Mutation('createTask')
  create(@Args('createTaskInput') createTaskInput: CreateTaskInput) {
    return this.taskService.create(createTaskInput);
  }

  @Roles(Role.ADMIN)
  @Query('tasks')
  findAll() {
    return this.taskService.findAll();
  }

  @Roles(Role.ADMIN)
  @Query('task')
  findOne(@Args('id') id: number) {
    return this.taskService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @Mutation('updateTask')
  update(@Args('updateTaskInput') updateTaskInput: UpdateTaskInput) {
    return this.taskService.update(updateTaskInput.id, updateTaskInput);
  }

  @Roles(Role.ADMIN)
  @Mutation('removeTask')
  remove(@Args('id') id: number) {
    return this.taskService.remove(id);
  }
}
