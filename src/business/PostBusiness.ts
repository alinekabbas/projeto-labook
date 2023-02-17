import { PostDatabase } from "../database/PostDatabase"
import { CreatePostInputDTO, DeletePostInputDTO, EditPostInputDTO, GetPostInputDTO, GetPostOuputDTO, LikeDislikePostInputDTO, PostDTO } from "../dtos/PostDTO"
import { BadRequestError } from "../errors/BadRequestError"
import { NotFoundError } from "../errors/NotFoundError"
import { Post } from "../models/Post"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"
import { PostWithCreatorDB, USER_ROLE } from "../types"

export class PostBusiness {
    constructor(
        private postDTO: PostDTO,
        private postDatabase: PostDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
    ) { }

    public getPosts = async (input: GetPostInputDTO) => {
        const { token } = input

        if (token === undefined) {
            throw new BadRequestError("'token' ausente")
        }

        const tokenPayload = this.tokenManager.getPayload(token)

        if (tokenPayload === null) {
            throw new BadRequestError("'token' inválido")
        }

        const postsDB: PostWithCreatorDB[] = await this.postDatabase.getPosts()

        const posts = postsDB.map((postDB) => {
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

    public createPost = async (input: CreatePostInputDTO) => {
        const { token, content } = input

        if (token === undefined) {
            throw new BadRequestError("'token' ausente")
        }

        if (content.length <= 0) {
            throw new BadRequestError("'content' não pode ser zero ou negativo")
        }

        const tokenPayload = this.tokenManager.getPayload(token)

        if (tokenPayload === null) {
            throw new BadRequestError("'token' inválido")
        }

        const id = this.idGenerator.generate()
        const creatorId = tokenPayload.id
        const creatorName = tokenPayload.name

        const newPost = new Post(
            id,
            content,
            0,
            0,
            new Date().toISOString(),
            new Date().toISOString(),
            creatorId,
            creatorName
        )

        const newPostDB = newPost.toDBModel()

        await this.postDatabase.insertPost(newPostDB)

        const output = this.postDTO.createPostOutput(newPost)

        return output
    }

    public editPost = async (input: EditPostInputDTO) => {
        const { id, token, content } = input

        if (token === undefined) {
            throw new BadRequestError("'token' ausente")
        }

        if (content.length <= 0) {
            throw new BadRequestError("'content' não pode ser zero ou negativo")
        }

        const tokenPayload = this.tokenManager.getPayload(token)

        if (tokenPayload === null) {
            throw new BadRequestError("'token' inválido")
        }

        const postToEditDB = await this.postDatabase.findPost(id)

        if (!postToEditDB) {
            throw new NotFoundError("'id' não encontrado")
        }

        const creatorId = tokenPayload.id

        if (postToEditDB.creator_id !== creatorId) {
            throw new BadRequestError("usuário não autorizado a editar este post")
        }

        const creatorName = tokenPayload.name

        const postToEdit = new Post(
            postToEditDB.id,
            postToEditDB.content,
            postToEditDB.likes,
            postToEditDB.dislikes,
            postToEditDB.created_at,
            postToEditDB.updated_at,
            creatorId,
            creatorName
        )

        postToEdit.setContent(content)
        postToEdit.setUpdatedAt(new Date().toISOString())

        const updatedPostDB = postToEdit.toDBModel()

        await this.postDatabase.updatePost(updatedPostDB)

        const output = this.postDTO.editPostOutput(postToEdit)

        return output

    }

    public deletePost = async (input: DeletePostInputDTO) => {
        const { id, token } = input

        if (token === undefined) {
            throw new BadRequestError("'token' ausente")
        }

        const tokenPayload = this.tokenManager.getPayload(token)

        if (tokenPayload === null) {
            throw new BadRequestError("'token' inválido")
        }

        const postToDeleteDB = this.postDatabase.findPost(id)

        if(!postToDeleteDB){
            throw new NotFoundError("'id' não encontrada")
        }

        const creatorId = tokenPayload.id

        if(
            tokenPayload.role !== USER_ROLE.ADMIN &&
            (await postToDeleteDB).creator_id !== creatorId    
        ){
            throw new BadRequestError("usuário não autorizado a deletar este post")
        }

        await this.postDatabase.deletePost(id)

        const output = this.postDTO.deletePostOutput()

        return output

    }

    public likeDislikePost = async (input: LikeDislikePostInputDTO) => {
        const {id, token, like} = input

        if (token === undefined) {
            throw new BadRequestError("'token' ausente")
        }

        const tokenPayload = this.tokenManager.getPayload(token)

        if (tokenPayload === null) {
            throw new BadRequestError("'token' inválido")
        }
    }

}