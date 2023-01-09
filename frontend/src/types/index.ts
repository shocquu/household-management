export type User = {
    id: number;
    email: string;
    password: string;
    username: string;
    displayName: string;
    avatarUrl: string;
    role: Role;
    tasks?: Task[];
    comments?: Comment[];
};

export type Task = {
    id: number;
    title: string;
    description?: string;
    completed: boolean;
    tags?: Tag[];
    comments?: Comment[];
    dueDate: number;
    createdAt: number;
    updatedAt: number;
};

export type Tag = {
    id: number;
    label: string;
    color: string;
};

export type Comment = {
    id: number;
    author: User;
    message: string;
    createdAt: string;
    updatedAt: string;
};

export enum Role {
    Admin = 'ADMIN',
    User = 'USER',
}

export enum AlertStatus {
    None = '',
    Info = 'info',
    Success = 'success',
    Warning = 'warning',
    Error = 'error',
}
