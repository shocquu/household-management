
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class CreateUserInput {
    name: string;
    email: string;
    password: string;
    avatar_url: string;
}

export class UpdateUserInput {
    id: number;
    name?: Nullable<string>;
    email?: Nullable<string>;
    password?: Nullable<string>;
    avatar_url?: Nullable<string>;
}

export class User {
    id: number;
    name: string;
    email: string;
    password: string;
    avatar_url: string;
}

export abstract class IQuery {
    abstract users(): Nullable<User>[] | Promise<Nullable<User>[]>;

    abstract user(id: number): Nullable<User> | Promise<Nullable<User>>;
}

export abstract class IMutation {
    abstract createUser(createUserInput: CreateUserInput): User | Promise<User>;

    abstract updateUser(updateUserInput: UpdateUserInput): User | Promise<User>;

    abstract removeUser(id: number): Nullable<User> | Promise<Nullable<User>>;
}

type Nullable<T> = T | null;
