// בעה"י
'use server'

import * as query from "../db/queries/users";
import type { NewUser, User } from "../db/queries/users";
import bcrypt from "bcryptjs";

export async function isUsernameAvailable(username: string) {
    const available = await query.isUsernameAvailable(username);
    return available
}

export async function isEmailAvailable(email: string) {
    const available = await query.isEmailAvailable(email);
    return available
}

export async function getUserByEmail(email: string) {
    const user = await query.getUserByEmail(email);
    return user;
}

export async function registerUser(username: string, email: string, password: string) {
    const hash: string = await bcrypt.hash(password, 10);
    const userProp : NewUser = {
        username,
        email,
        password: hash, // In a real application, make sure to hash the password before storing it
    }
    const user = await query.registerUser(userProp);
    return user;
}