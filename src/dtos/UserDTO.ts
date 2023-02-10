import { BadRequestError } from "../errors/BadRequestError";
import { User } from "../models/User";
import { ROLE } from "../types";

export interface SignupUsersInputDTO {
    id: string,
    name: string,
    email: string,
    password: string,
    role: ROLE
}

export interface SignupUsersOutputDTO {
    message: string,
    newUser: {
        id: string,
        name: string,
        email: string,
        password: string,
        role: ROLE
    }
}

export interface LoginUserInputDTO {
    email: string,
    password: string
}

export interface LoginUserOutputDTO {
    message: string,
    user: {
        email: string,
        password: string
    }
}

export class UserDTO {
    public signupUsersInput(
        id: unknown,
        name: unknown,
        email: unknown,
        password: unknown,
        role: unknown
    ): SignupUsersInputDTO {
        if (typeof id !== "string") {
            throw new BadRequestError("'id' deve ser string")
        }

        if (typeof name !== "string") {
            throw new BadRequestError("'name' deve ser string")
        }

        if (typeof email !== "string") {
            throw new BadRequestError("'email' deve ser string")
        }

        if (typeof password !== "string") {
            throw new BadRequestError("'password' deve ser string")
        }

        if(
            role !== ROLE.ADMIN &&
            role !== ROLE.USER
        ){
            throw new BadRequestError("'role' deve ser administrador ou usuário")
        }

        const dto: SignupUsersInputDTO = {
            id,
            name,
            email,
            password,
            role
        }

        return dto
    }

    public signupUsersOutput(newUser: User):SignupUsersOutputDTO{
        const dto: SignupUsersOutputDTO = {
            message: "Usuário inscrito com sucesso",
            newUser: {
                id: newUser.getId(),
                name: newUser.getName(),
                email: newUser.getEmail(),
                password: newUser.getPassword(),
                role: newUser.getRole()
            }  
        }
        return dto
    }

    public loginUserInput(
        email: unknown,
        password: unknown
    ): LoginUserInputDTO{
        if (typeof email !== "string") {
            throw new BadRequestError("'email' deve ser string")
        }

        if (typeof password !== "string") {
            throw new BadRequestError("'password' deve ser string")
        }
        const dto: LoginUserInputDTO = {
            email,
            password
        }
        return dto
    }

    public loginUserOutput(email: string, password: string ): LoginUserOutputDTO{
        const dto:LoginUserOutputDTO = {
            message: "Login efetuado com sucesso",
            user: {
                email: email,
                password: password
            }
        }
        return dto
    }
}