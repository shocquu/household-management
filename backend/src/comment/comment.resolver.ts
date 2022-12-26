import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CreateCommentInput, UpdateCommentInput } from 'src/types/graphql';
import { CommentService } from './comment.service';

@Resolver('Comment')
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}

  @Mutation('createComment')
  create(@Args('createCommentInput') createCommentInput: CreateCommentInput) {
    return this.commentService.create(createCommentInput);
  }

  @Query('comments')
  findAll() {
    return this.commentService.findAll();
  }

  @Query('comment')
  findOne(@Args('id') id: number) {
    return this.commentService.findOne(id);
  }

  @Mutation('updateComment')
  update(@Args('updateCommentInput') updateCommentInput: UpdateCommentInput) {
    return this.commentService.update(
      updateCommentInput.id,
      updateCommentInput,
    );
  }

  @Mutation('removeComment')
  remove(@Args('id') id: number) {
    return this.commentService.remove(id);
  }
}
