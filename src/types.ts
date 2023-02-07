export enum ROLE {
    ADMIN = "administrador",
    USER = "usuário"
}

export interface UserDB {
    id: string,
    name: string,
    email: string,
    password: string,
    role: ROLE,
    created_at: string
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

export interface LikesDislikesDB {
    user_id: string,
    post_id: string,
    like: number
}