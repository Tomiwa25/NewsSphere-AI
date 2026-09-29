import { Request, Response } from "express";

import { registerUser, loginUser } from "../services/authService";

export const register = async(req:Request, res:Response)=>{
    const user = await registerUser(req.body);
    res.json(user)
}

export const login = async(req:Request, res:Response)=>{
    const token = await loginUser(req.body);
    res.json(token)
}