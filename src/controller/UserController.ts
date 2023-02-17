import { Request, Response } from "express";
import { UserBusiness } from "../business/UserBusiness";
import { UserDTO } from "../dtos/UserDTO";
import { BaseError } from "../errors/BaseError";

export class UserController {
    constructor(
        private userDTO: UserDTO,
        private userbusiness: UserBusiness
    ){}

    public getAllUsers = async (req:Request, res:Response) => {
        try {
           const output = await this.userbusiness.getAllUsers() 

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

    public signupUsers = async (req: Request, res: Response) =>{
        try {
            const input = this.userDTO.signupUsersInput(
                req.body.name,
                req.body.email,
                req.body.password
            ) 

            const output = await this.userbusiness.signupUsers(input)

            res.status(201).send(output)
            
        } catch (error: any) {
            console.log(error)
    
            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public loginUser = async (req: Request, res: Response) =>{
        try {
            const input = this.userDTO.loginUserInput(
                req.body.email,
                req.body.password
            ) 
    
            const output = await this.userbusiness.loginUser(input)

            res.status(200).send(output)

        } catch (error: any) {
            console.log(error)
    
            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }
}