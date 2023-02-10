import { UserDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";

export class UserDatabase extends BaseDatabase {
    public static TABLE_USERS = "users"

    public async getAllUsers(){
        const result: UserDB[] =  await BaseDatabase.connection(UserDatabase.TABLE_USERS)
        return result
    }

    public async findUser(id: string, email: string){
        const [userDB]: UserDB[] | undefined [] = await BaseDatabase
            .connection(UserDatabase.TABLE_USERS)
            .where({id})
            .orWhere({email})
        
        return userDB
    }

    public async insertUser(newUserDB: UserDB) {
        await BaseDatabase
            .connection(UserDatabase.TABLE_USERS)
            .insert(newUserDB)
    }

    public async findUserLogin(email: string, password: string){
        const [userDB]: UserDB[] | undefined [] = await BaseDatabase
            .connection(UserDatabase.TABLE_USERS)
            .where({email})
            .andWhere({password})
        
        return userDB
    }

}