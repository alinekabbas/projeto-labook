import { PostDatabase } from "../database/PostDatabase"
import { GetPostInputDTO, GetPostOuputDTO, PostDTO } from "../dtos/PostDTO"
import { BadRequestError } from "../errors/BadRequestError"
import { Post } from "../models/Post"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"
import { PostWithCreatorDB } from "../types"

export class PostBusiness {
    constructor(
        private postDTO: PostDTO,
        private postDatabase: PostDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
    ){}

    public getPosts = async (input: GetPostInputDTO): Promise<GetPostOuputDTO> => {
        const {token} = input

        if(token === undefined){
            throw new BadRequestError("'token' ausente")
        }

        const tokenPayload = this.tokenManager.getPayload(token)

        if(tokenPayload === null){
            throw new BadRequestError("'token' inválido")
        }

        const postsDB: PostWithCreatorDB[] = await this.postDatabase.getPosts()

        const posts = postsDB.map((postDB)=>{
            const post = new Post(
                postDB.id,
                postDB.content,
                postDB.likes,
                postDB.dislikes,
                postDB.created_at,
                postDB.updated_at,
                postDB.creator_id,
                postDB.creator_name
            )
            return post.toBusinessModel()
        })
        
        const output: GetPostOuputDTO = posts

        return output

    }

    public createPost = async () =>{
        
    }
}