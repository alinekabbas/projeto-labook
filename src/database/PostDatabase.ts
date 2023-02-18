import { LikesDislikesDB, PostsDB, PostWithCreatorDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";

export class PostDatabase extends BaseDatabase {
    public static TABLE_POSTS = "posts"
    public static TABLE_LIKES_DISLIKES = "likes_dislikes"

    public async getPosts() {
        const result: PostWithCreatorDB[] = await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .select(
                "posts.id",
                "posts.content",
                "posts.likes",
                "posts.dislikes",
                "posts.created_at",
                "posts.updated_at",
                "posts.creator_id",
                "users.name AS creator_name"
            )
            .join("users", "posts.creator_id", "=", "users.id")
        return result
    }

    public async insertPost(newPostDB: PostsDB) {
        await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .insert(newPostDB)
    }

    public async findPost(id: string) {
        const [postDB]: PostsDB[] | undefined = await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .where({ id })

        return postDB
    }

    public async updatePost(postDB: PostsDB) {
        await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .update(postDB)
            .where({ id: postDB.id })
    }

    public async deletePost(id: string) {
        await BaseDatabase
            .connection(PostDatabase.TABLE_LIKES_DISLIKES)
            .delete()
            .where({ post_id: id })

        await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .delete()
            .where({ id: id })
    }

    public async findPostWithCreatorId(id: string) {
        const result: PostWithCreatorDB[] | undefined = await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .select(
                "posts.id",
                "posts.content",
                "posts.likes",
                "posts.dislikes",
                "posts.created_at",
                "posts.updated_at",
                "posts.creator_id",
                "users.name AS creator_name"
            )
            .join("users", "posts.creator_id", "=", "users.id")
            .where("posts.id", id)

        return result[0]
    }

    public async likeOrDislikePost(likeDislike: LikesDislikesDB) {
        await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES)
            .insert(likeDislike)
    }

    public async findLikeDislike(likeDislike: LikesDislikesDB) {
        const [likeDislikeDB]: LikesDislikesDB[] = await BaseDatabase
            .connection(PostDatabase.TABLE_LIKES_DISLIKES)
            .select()
            .where({
                user_id: likeDislike.user_id,
                post_id: likeDislike.post_id
            })
        if(likeDislikeDB){
            return likeDislikeDB.like === 1 ? "already liked" : "already disliked"
        } else {
            return null
        }
    }

    public async removeLikeDislike (likeDislike: LikesDislikesDB) {
        await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES)
            .delete()
            .where({
                user_id: likeDislike.user_id,
                post_id: likeDislike.post_id
            })
    }

    public async updateLikeDislike (likeDislike: LikesDislikesDB){
        await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES)
            .update(likeDislike)
            .where({
                user_id: likeDislike.user_id,
                post_id: likeDislike.post_id
            })
    }

}