export enum USER_ROLE {
    ADMIN = "administrador",
    USER = "usuário"
}

export interface UserModel {
    id: string,
    name: string,
    email: string,
    password: string,
    role: USER_ROLE,
    createdAt: string
}

export interface UserDB {
    id: string,
    name: string,
    email: string,
    password: string,
    role: USER_ROLE,
    created_at: string
}

export interface PostModel {
    id: string,
    content: string,
    likes: number,
    dislikes: number,
    createdAt: string,
    updatedAt: string,
    creator: {
        id: string,
        name: string
    }
}

export interface PostsDB {
    id: string,
    creator_id: string,
    content: string,
    likes: number,
    dislikes: number,
    created_at: string,
    updated_at: string
}

export interface PostWithCreatorDB extends PostsDB{
    creator_name: string
}

export interface LikesDislikesDB {
    user_id: string,
    post_id: string,
    like: number
}

export interface TokenPayload {
    id: string,
	name: string,
    role: USER_ROLE
}

