export type User = {
    id: number;
    email: string;
    password: string;
    username: string;
    displayName: string;
    avatarUrl: string;
    role: Role;
    settings: {
        dateFormat: string;
        timeFormat: string;
    };
    refreshToken: string | null;
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

export enum LabelColors {
    green = '#7bc86c',
    caribbeanGreen = '#00c49a',
    blue = '#5ca4cf',
    skyBlue = '#2acce5',
    pink = '#ff8dd4',
    purple = '#cd8de5',
    yellow = '#f5dd2a',
    yellowCrayola = '#f8e16c',
    orange = '#ffaf3e',
    melon = '#ffc2b4',
    red = '#ef7564',
    coral = '#fb8f67',
}
