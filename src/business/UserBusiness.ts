import { UserDatabase } from "../database/UserDatabase"
import { LoginUserInputDTO, LoginUserOutputDTO, SignupUsersInputDTO, SignupUsersOutputDTO, UserDTO } from "../dtos/UserDTO"
import { BadRequestError } from "../errors/BadRequestError"
import { NotFoundError } from "../errors/NotFoundError"
import { User } from "../models/User"
import { HashManager } from "../services/HashManager"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"
import { USER_ROLE, TokenPayload, UserDB } from "../types"

export class UserBusiness {
    constructor(
        private userDTO: UserDTO,
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
        private hashManager: HashManager
    ){}

    public getAllUsers = async()=>{
        const usersDB = this.userDatabase.getAllUsers()

        const users: User[] = (await usersDB).map((userDB)=> new User(
            userDB.id,
            userDB.name,
            userDB.email,
            userDB.password,
            userDB.role,
            userDB.created_at
        ))

        return({users})
    }

    public signupUsers = async (input: SignupUsersInputDTO): Promise<SignupUsersOutputDTO> =>{
        const {name, email, password} = input

        if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
            throw new BadRequestError("O email deve ter o formato 'exemplo@exemplo.com'.")
        }

        if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,12}$/g)) {
			throw new BadRequestError("'password' deve possuir entre 8 e 12 caracteres, com letras maiúsculas e minúsculas e no mínimo um número e um caractere especial")
		}

        const userDBExists = await this.userDatabase.findUser(email)

        if(userDBExists) {
            throw new BadRequestError("'email' já cadastrado")            
        }

        const id = this.idGenerator.generate()
        const hashedPassword = await this.hashManager.hash(password)
        const role = USER_ROLE.USER

        const newUser = new User(
            id,
            name,
            email,
            hashedPassword,
            role,
            new Date().toISOString()
        )

        const newUserDB: UserDB = {
            id: newUser.getId(),
            name: newUser.getName(),
            email: newUser.getEmail(),
            password: newUser.getPassword(),
            role: newUser.getRole(),
            created_at: newUser.getCreatedAt()
        }

        await this.userDatabase.insertUser(newUserDB)

        const tokenPayload: TokenPayload = {
            id: newUser.getId(),
            name: newUser.getName(),
            role: newUser.getRole()
        }

        const token = this.tokenManager.createToken(tokenPayload)

        const output = this.userDTO.signupUsersOutput(newUser, token)

        return output
    }

    public loginUser = async (input: LoginUserInputDTO): Promise<LoginUserOutputDTO> =>{
        const {email, password} = input

        if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
            throw new BadRequestError("O email deve ter o formato 'exemplo@exemplo.com'.")
        }

        if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,12}$/g)) {
			throw new BadRequestError("'password' deve possuir entre 8 e 12 caracteres, com letras maiúsculas e minúsculas e no mínimo um número e um caractere especial")
		}

        const userDBExists = await this.userDatabase.findUser(email)

        if(!userDBExists) {
            throw new NotFoundError("'email' incorreto ou não cadastrado")            
        }

        const user = new User(
            userDBExists.id,
            userDBExists.name,
            userDBExists.email,
            userDBExists.password,
            userDBExists.role,
            userDBExists.created_at
        )

        const hashedPassword = user.getPassword()

        const isPasswordCorrect = await this.hashManager.compare(password, hashedPassword)

        if(!isPasswordCorrect){
            throw new BadRequestError("'Senha' incorreta")
        }

        const tokenPayload: TokenPayload = {
            id: user.getId(),
            name: user.getName(),
            role: user.getRole()
        }

        const token = this.tokenManager.createToken(tokenPayload)

        const output = this.userDTO.loginUserOutput(token)

        return output
    }
}