
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum Role {
    ADMIN = "ADMIN",
    USER = "USER"
}

export class CreateCommentInput {
    taskId: number;
    authorId: number;
    message: string;
}

export class UpdateCommentInput {
    id: number;
    taskId: number;
    authorId: number;
    message?: Nullable<string>;
}

export class CreateTagInput {
    label: string;
    color: string;
}

export class UpdateTagInput {
    id: number;
    label?: Nullable<string>;
    color?: Nullable<string>;
}

export class CreateTaskInput {
    userId: number;
    title: string;
    description?: Nullable<string>;
    commentId?: Nullable<number>;
}

export class UpdateTaskInput {
    id: number;
    title?: Nullable<string>;
    description?: Nullable<string>;
    userId?: Nullable<number>;
    commentId?: Nullable<number>;
}

export class CreateUserInput {
    email: string;
    username: string;
    displayName: string;
    password: string;
    avatarUrl: string;
    taskId?: Nullable<number>;
    commentId?: Nullable<number>;
}

export class UpdateUserInput {
    id: number;
    email?: Nullable<string>;
    username?: Nullable<string>;
    displayName?: Nullable<string>;
    password?: Nullable<string>;
    avatarUrl?: Nullable<string>;
}

export class LoginUserInput {
    email: string;
    password: string;
}

export class UpdatePasswordInput {
    id: number;
    oldPassword?: Nullable<string>;
    newPassword?: Nullable<string>;
}

export class Comment {
    id: number;
    task: Task;
    author: User;
    message: string;
    createdAt: string;
    updatedAt: string;
}

export abstract class IQuery {
    abstract comments(): Nullable<Comment>[] | Promise<Nullable<Comment>[]>;

    abstract comment(id: number): Nullable<Comment> | Promise<Nullable<Comment>>;

    abstract tags(): Nullable<Tag>[] | Promise<Nullable<Tag>[]>;

    abstract tag(id: number): Nullable<Tag> | Promise<Nullable<Tag>>;

    abstract tasks(): Nullable<Task>[] | Promise<Nullable<Task>[]>;

    abstract task(id: number): Nullable<Task> | Promise<Nullable<Task>>;

    abstract users(): Nullable<User>[] | Promise<Nullable<User>[]>;

    abstract user(id: number): Nullable<User> | Promise<Nullable<User>>;

    abstract whoami(): Nullable<User> | Promise<Nullable<User>>;
}

export abstract class IMutation {
    abstract createComment(createCommentInput: CreateCommentInput): Comment | Promise<Comment>;

    abstract updateComment(updateCommentInput: UpdateCommentInput): Comment | Promise<Comment>;

    abstract removeComment(id: number): Nullable<Comment> | Promise<Nullable<Comment>>;

    abstract createTag(createTagInput: CreateTagInput): Tag | Promise<Tag>;

    abstract updateTag(updateTagInput: UpdateTagInput): Tag | Promise<Tag>;

    abstract removeTag(id: number): Nullable<Tag> | Promise<Nullable<Tag>>;

    abstract createTask(createTaskInput: CreateTaskInput): Task | Promise<Task>;

    abstract updateTask(updateTaskInput: UpdateTaskInput): Task | Promise<Task>;

    abstract removeTask(id: number): Nullable<Task> | Promise<Nullable<Task>>;

    abstract createUser(createUserInput: CreateUserInput): User | Promise<User>;

    abstract updateUser(updateUserInput: UpdateUserInput): User | Promise<User>;

    abstract removeUser(id: number): Nullable<User> | Promise<Nullable<User>>;

    abstract loginUser(loginUserInput: LoginUserInput): LoggedUserOutput | Promise<LoggedUserOutput>;

    abstract updatePassword(updatePasswordInput: UpdatePasswordInput): User | Promise<User>;
}

export class Tag {
    id: number;
    label: string;
    color: string;
    tasks?: Nullable<Nullable<Task>[]>;
}

export class Task {
    id: number;
    title: string;
    description?: Nullable<string>;
    createdAt: string;
    updatedAt: string;
    user: User;
    tags?: Nullable<Nullable<Tag>[]>;
    comments?: Nullable<Nullable<Comment>[]>;
}

export class User {
    id: number;
    email: string;
    username: string;
    displayName: string;
    password: string;
    avatarUrl: string;
    role: Role;
    tasks?: Nullable<Nullable<Task>[]>;
    comments?: Nullable<Nullable<Comment>[]>;
}

export class LoggedUserOutput {
    accessToken?: Nullable<string>;
}

type Nullable<T> = T | null;
