import jwt from "jsonwebtoken";


export const getUserFromHeader = async (token: string ) => {
    try {
        const user = jwt.verify(token, `${process.env.JWT_SECRET}`);
        if(!user) throw new Error("User not found");
        return user;
    } catch (error) {
        return null;
    }
}