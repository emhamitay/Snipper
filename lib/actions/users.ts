// בעה"י
"use server";

import * as query from "../db/queries/users";
import type { NewUser, User } from "../db/queries/users";
import bcrypt from "bcryptjs";
import { registerSchema } from "../validations/users";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

export async function isUsernameAvailable(username: string) {
  const available = await query.isUsernameAvailable(username);
  return available;
}

export async function isEmailAvailable(email: string) {
  const available = await query.isEmailAvailable(email);
  return available;
}

export async function getUserByEmail(email: string) {
  const user = await query.getUserByEmail(email);
  return user;
}

export async function registerUser(
  username: string,
  email: string,
  password: string,
) {
  const validation = registerSchema.safeParse({ username, email, password });
  if (validation.success === false) {
    throw new Error("Invalid input");
  }

  // Check if username and email are available
  const isUsernameAvailable = await query.isUsernameAvailable(username);
  const isEmailAvailable = await query.isEmailAvailable(email);

  if (!isUsernameAvailable || !isEmailAvailable) {
    throw new Error("Username or email is already taken");
  }

  const hash: string = await bcrypt.hash(password, 10);
  const userProp: NewUser = {
    username,
    email,
    password: hash, // In a real application, make sure to hash the password before storing it
  };
  const user = await query.registerUser(userProp);
  return user;
}

export async function registerGithubUser(username: string, githubId: string) {
  const userProp: NewUser = {
    username,
    githubId,
  };
  const user = await query.registerUser(userProp);
  return user;
}

export async function getGithubUserByGithubId(githubId: string) {
  const user = await query.getGithubUserByGithubId(githubId);
  return user;
}

export async function getGithubUserIdFromSession(){
  const session = await getServerSession(authOptions);
  if(session?.user?.githubId) {
    return session.user.githubId as string;
  }
  return null;
}