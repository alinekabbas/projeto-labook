import { UserDatabase } from "../database/UserDatabase"
import { UserDTO } from "../dtos/UserDTO"
import { BadRequestError } from "../errors/BadRequestError"
import { NotFoundError } from "../errors/NotFoundError"
import { User } from "../models/User"
import { UserDB, UserLoginDB } from "../types"

export class UserBusiness {
    constructor(
        private userDTO: UserDTO,
        private userDatabase: UserDatabase
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

    public signupUsers = async (input: any) =>{
        const {id, name, email, password, role} = input

        if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
            throw new BadRequestError("O email deve ter o formato 'exemplo@exemplo.com'.")
        }

        if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,12}$/g)) {
			throw new BadRequestError("'password' deve possuir entre 8 e 12 caracteres, com letras maiúsculas e minúsculas e no mínimo um número e um caractere especial")
		}

        const userDBExists = await this.userDatabase.findUser(id, email)

        if(userDBExists) {
            throw new BadRequestError("'id' ou 'email já cadastrados")            
        }

        const newUser = new User(
            id,
            name,
            email,
            password,
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

        const output = this.userDTO.signupUsersOutput(newUser)

        return output
    }

    public loginUser = async (input: any) =>{
        const {email, password} = input

        if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
            throw new BadRequestError("O email deve ter o formato 'exemplo@exemplo.com'.")
        }

        if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,12}$/g)) {
			throw new BadRequestError("'password' deve possuir entre 8 e 12 caracteres, com letras maiúsculas e minúsculas e no mínimo um número e um caractere especial")
		}

        const userDBExists = await this.userDatabase.findUserLogin(email, password)

        if(!userDBExists) {
            throw new NotFoundError("Usuário e/ou senha incorretos")            
        }

        const output = this.userDTO.loginUserOutput(email, password)

        return output
    }
}