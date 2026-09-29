import bcrypt from "bcrypt";
import User from "../models/User";
import { generateToken } from "../utils/token";

export const  registerUser =async(data:any)=>{
    const hashedPassword=await bcrypt.hash(data.password, 10);

    const user = await User.create({
    name:data.name,
    email:data.email,
    password:hashedPassword
});

    return user;
}

export const loginUser=async(data:any)=>{
    const user = await User.findOne({
        email:data.email
    });

    if(!user) {
        throw new Error("Invalid Credentials");
    }

    const matchedPassword = await bcrypt.compare(data.password, user.password);

    if(!matchedPassword) {
        throw new Error("Invalid Credentials")
    }

    return generateToken(user._id.toString())
}

