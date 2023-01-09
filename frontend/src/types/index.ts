export type User = {
    id: number;
    email: string;
    password: string;
    username: string;
    displayName: string;
    avatarUrl: string;
    role: ERole;
    tasks?: Task[];
    comments?: Comment[];
};

export type Task = {
    id: number;
    title: string;
    description?: string;
    tags?: Tag[];
    comments?: Comment[];
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

export enum ERole {
    ADMIN = 'ADMIN',
    USER = 'USER',
}

export enum AlertStatus {
    None = '',
    Info = 'info',
    Success = 'success',
    Warning = 'warning',
    Error = 'error',
}
