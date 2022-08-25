import jwt from "jsonwebtoken";


export const getUserFromHeader = async (token: string | undefined) => {
    if (!token) throw new Error("Invalid user token");
    try {
        const user = jwt.verify(token, `${process.env.JWT_SECRET}`);
        if(!user) throw new Error("User not found");
        return user;
    } catch (error) {
        return null;
    }
}