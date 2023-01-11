import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Roles } from 'src/role/role.decorator';
import { CreateTagInput, Role, UpdateTagInput } from 'src/types/graphql';
import { TagService } from './tag.service';

@Resolver('Tag')
export class TagResolver {
  constructor(private readonly tagService: TagService) {}

  @Roles(Role.ADMIN)
  @Mutation('createTag')
  create(@Args('createTagInput') createTagInput: CreateTagInput) {
    return this.tagService.create(createTagInput);
  }

  @Query('tags')
  findAll() {
    return this.tagService.findAll();
  }

  @Query('tag')
  findOne(@Args('id') id: number) {
    return this.tagService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @Mutation('updateTag')
  update(@Args('updateTagInput') updateTagInput: UpdateTagInput) {
    return this.tagService.update(updateTagInput.id, updateTagInput);
  }

  @Roles(Role.ADMIN)
  @Mutation('removeTag')
  remove(@Args('id') id: number) {
    return this.tagService.remove(id);
  }

  @Roles(Role.ADMIN)
  @Mutation('removeTags')
  removeMany(@Args('ids') ids: number[]) {
    const a = this.tagService.removeMany(ids);

    return a;
  }
}
