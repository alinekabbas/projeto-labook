import { Request, Response } from "express";
import { UserBusiness } from "../business/UserBusiness";
import { BaseError } from "../errors/BaseError";

export class UserController {
    public signupUsers = async (req: Request, res: Response) =>{
        try {
            const input = {
                id: req.body.id,
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                role: req.body.role
            }

            const userbusiness = new UserBusiness()
            const output = await userbusiness.signupUsers(input)

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
            const input = {
                email: req.body.email,
                password: req.body.password
            }
            const userbusiness = new UserBusiness()
            const output = await userbusiness.loginUser(input)

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