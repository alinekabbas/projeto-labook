import { BadRequestError } from "../errors/BadRequestError"
import { Post } from "../models/Post"
import { PostModel } from "../types"

export interface GetPostInputDTO {
    token: string | undefined
}

export type GetPostOuputDTO = PostModel[]

export class PostDTO {
    public getPostInput(
        token: unknown
    ): GetPostInputDTO {
        if (typeof token !== "string") {
            throw new BadRequestError("'token' deve ser string")
        }

        const dto: GetPostInputDTO = {
            token
        }

        return dto
    }

    // public getPostOutput(post: Post): GetPostOuputDTO {
    //     const dto: GetPostOuputDTO = {
    //         id: post.getId(),
    //         content: post.getContent(),
    //         likes: post.getLikes(),
    //         dislikes: post.getDislikes(),
    //         createdAt: post.getCreatedAt(),
    //         updatedAt: post.getUpdatedAt(),
    //         creator: {
    //             id: post.getCreatorId(),
    //             name: post.getCreatorName()
    //         }
    //     }
    //     return dto
    // }   
}