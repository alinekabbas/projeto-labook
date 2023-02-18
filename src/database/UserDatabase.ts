import { UserDB } from "../types";
import { BaseDatabase } from "./BaseDatabase"

export class UserDatabase extends BaseDatabase {
    public static TABLE_USERS = "users"

    public async findUser(email: string){
        const [userDB]: UserDB[] | undefined [] = await BaseDatabase
            .connection(UserDatabase.TABLE_USERS)
            .where({email})        
        return userDB
    }

    public async insertUser(newUserDB: UserDB) {
        await BaseDatabase
            .connection(UserDatabase.TABLE_USERS)
            .insert(newUserDB)
    }


}