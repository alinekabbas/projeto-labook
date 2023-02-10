import express from "express"
import { UserBusiness } from "../business/UserBusiness"
import { UserController } from "../controller/UserController"
import { UserDatabase } from "../database/UserDatabase"
import { UserDTO } from "../dtos/UserDTO"

export const userRouter = express.Router()

const userController = new UserController(
    new UserDTO(),
    new UserBusiness(
        new UserDTO(),
        new UserDatabase()
    )
)

userRouter.get("/", userController.getAllUsers)
userRouter.post("/signup", userController.signupUsers)
userRouter.post("/login", userController.loginUser)
