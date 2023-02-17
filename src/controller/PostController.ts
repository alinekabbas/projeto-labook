import { Request, Response } from "express"
import { PostBusiness } from "../business/PostBusiness"
import { BaseError } from "../errors/BaseError"

export class PostController {
    constructor(
        private postBusinnes: PostBusiness
    ){}

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

    public createPost = async (req: Request, res: Response) =>{
        try {
            
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