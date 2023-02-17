import { BadRequestError } from "../errors/BadRequestError";
import { User } from "../models/User";

export interface SignupUsersInputDTO {
    name: string,
    email: string,
    password: string
}

export interface SignupUsersOutputDTO {
    message: string,
    newUser: {
        name: string,
        email: string
    },
    token: string
}

export interface LoginUserInputDTO {
    email: string,
    password: string
}

export interface LoginUserOutputDTO {
    message: string,
    token: string
}

export class UserDTO {
    public signupUsersInput(
        name: unknown,
        email: unknown,
        password: unknown
    ): SignupUsersInputDTO {
        if (typeof name !== "string") {
            throw new BadRequestError("'name' deve ser string")
        }

        if (typeof email !== "string") {
            throw new BadRequestError("'email' deve ser string")
        }

        if (typeof password !== "string") {
            throw new BadRequestError("'password' deve ser string")
        }

        const dto: SignupUsersInputDTO = {
            name,
            email,
            password
        }

        return dto
    }

    public signupUsersOutput(newUser: User, token: string):SignupUsersOutputDTO{
        const dto: SignupUsersOutputDTO = {
            message: "Usuário inscrito com sucesso",
            newUser: {
                name: newUser.getName(),
                email: newUser.getEmail()
            },
            token
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

    public loginUserOutput(token: string): LoginUserOutputDTO{
        const dto:LoginUserOutputDTO = {
            message: "Login efetuado com sucesso",
            token
        }
        return dto
    }
}