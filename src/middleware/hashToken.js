import jwt from "jsonwebtoken"
import dotenv from "dotenv/config"
import userSchema from "../models/userSchema.js";
import sessionSchema from "../models/sessionSchema.js";


export const hashToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer")) {
            return res.status(400).json({
                success: false,
                message: "Token invalid authorization or not found"
            })
        }
        else {
            const token = authHeader.split(" ")[1]
            console.log("Token:", token);
            jwt.verify(token, process.env.secretKey, async (err, decoded) => {
                if (err) {
                    if (err.message === "ExpiredTokenError") {
                        return res.status(400).json({
                            success: false,
                            message: "Token Expired"
                        })

                    } return res.status(400).json({
                        success: false,
                        message: "Token invalid"
                    })
                } else {
                    const { _id } = decoded;
                    const user = await userSchema.findById(_id)
                    if (!user) {
                        return res.status(400).json({
                            success: false,
                            message: "User not found"
                        })
                    }

                    const existing = await sessionSchema.findOne({ userId: _id })
                    if (existing) {
                        req.userId = _id;
                        next()

                    } else {
                        return res.status(400).json({
                            success: false,
                            message: "User logged out successfully"
                        })
                    };
                };
            });
        };

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}