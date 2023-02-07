import { UserDatabase } from "../database/UserDatabase"
import { BadRequestError } from "../errors/BadRequestError"
import { NotFoundError } from "../errors/NotFoundError"
import { User } from "../models/User"
import { ROLE, UserDB } from "../types"

export class UserBusiness {
    public signupUsers = async (input: any) =>{
        const {id, name, email, password, role} = input

        if( typeof id !== "string"){
            throw new BadRequestError("'id' deve ser string")            
        }

        if( typeof name !== "string"){
            throw new BadRequestError("'name' deve ser string")            
        }

        if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
            throw new BadRequestError("O email deve ter o formato 'exemplo@exemplo.com'.")
        }

        if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,12}$/g)) {
			throw new BadRequestError("'password' deve possuir entre 8 e 12 caracteres, com letras maiúsculas e minúsculas e no mínimo um número e um caractere especial")
		}

        if(
            role !== ROLE.ADMIN &&
            role !== ROLE.USER
        ){
            throw new BadRequestError("'role' deve ser administrador ou usuário")
        }

        const userDatabase = new UserDatabase()
        const userDBExists = await userDatabase.findUser(id, email)

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

        await userDatabase.insertUser(newUserDB)

        const output = {
            message: "Usuário inscrito com sucesso",
            newUser: newUser
        }

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

        const userDatabase = new UserDatabase()
        const userDBExists = await userDatabase.findUserLogin(email, password)

        if(!userDBExists) {
            throw new NotFoundError("Usuário e/ou senha incorretos")            
        }

        const output = {
            message: "Login efetuado com sucesso",
            user: userDBExists
        }

        return output
    }
}