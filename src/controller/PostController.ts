import { Request, Response } from "express"
import { PostBusiness } from "../business/PostBusiness"
import { PostDTO } from "../dtos/PostDTO"
import { BaseError } from "../errors/BaseError"

export class PostController {
    constructor(
        private postDTO: PostDTO,
        private postBusinnes: PostBusiness
    ) { }

    public getPosts = async (req: Request, res: Response) => {
        try {
            const input = {
                token: req.headers.authorization
            }
            const output = await this.postBusinnes.getPosts(input)

            res.status(200).send(output)

        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public createPost = async (req: Request, res: Response) => {
        try {
            const input = this.postDTO.createPostInput(
                req.headers.authorization,
                req.body.content
            )

            const output = await this.postBusinnes.createPost(input)

            res.status(201).send(output)

        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }

    }

    public editPost = async (req: Request, res: Response) => {
        try {
            const input = this.postDTO.editPostInput(
                req.params.id,
                req.headers.authorization,
                req.body.content
            )

            const output = await this.postBusinnes.editPost(input)

            res.status(201).send(output)

        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public deletePost = async (req: Request, res: Response) => {
        try {
            const input = this.postDTO.deletePostInput(
                req.params.id,
                req.headers.authorization
            )

            const output = await this.postBusinnes.deletePost(input)

            res.status(200).send(output)

        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public likeDislikePost = async (req: Request, res: Response) => {
        try {
            const input = this.postDTO.likeDislikePostInput(
                req.params.id,
                req.headers.authorization,
                req.body.like
            )

            const output = await this.postBusinnes.likeDislikePost(input)

            res.status(200).send(output)

        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

}