export type User = {
    id: number;
    email: string;
    password: string;
    name: string;
    avatar_url: string;
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
