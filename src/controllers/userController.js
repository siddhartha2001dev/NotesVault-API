import userSchema from "../models/userSchema.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv/config";
import jwt from "jsonwebtoken";
import { verifyEmail } from "../email/verifyMail.js";
import sessionSchema from "../models/sessionSchema.js";



//User Register
export const userRegister = async (req, res) => {

    try {
        const { userName, email, password } = req.body;
        const existingUser = await userSchema.findOne({ email })
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exist."
            })
        }

        const hashPassword = await bcrypt.hash(password, 10)
        const newUser = await userSchema.create({ userName, email, password: hashPassword });

        const token = jwt.sign({ _id: newUser.id }, process.env.secretKey, { expiresIn: "7m" })

        await verifyEmail(token, email);
        newUser.token = token;
        await newUser.save();
        return res.status(201).json({
            success: true,
            message: "User registered successfully!",
            data: newUser
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    };
};



//logIn
export const userLogin = async (req, res) => {

    try {
        const { email, password } = req.body;
        const user = await userSchema.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "user not found"
            })
        }

        else {
            const matchedpassword = await bcrypt.compare(password, user.password)
            console.log(matchedpassword);
            if (matchedpassword && user.isVerified === true) {

                await sessionSchema.findOneAndDelete({userId: req.userId})
                await sessionSchema.create({ userId: user._id })


                const accessToken = jwt.sign({ _id: user.id }, process.env.secretKey,
                    { expiresIn: "7d" });

                const refreshToken = jwt.sign({ _id: user.id }, process.env.secretKey,
                    { expiresIn: "30d" });

                user.isLoggedin = true
                await user.save()
                return res.status(200).json({
                    success: true,
                    message: "User loggedin successfully",
                    data: user,
                    accessToken: accessToken,
                    refreshToken: refreshToken
                })
            } else if (!matchedpassword) {
                return res.status(400).json({
                    success: false,
                    message: "Mismatch credentials"
                })
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Please verify first the try again to login"
                })
            }
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }

}


// Refresh Token
export const refreshToken = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer")) {
            return res.status(401).json({
                success: false,
                message: "Refresh token not found"
            });
        }

        const token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.secretKey, async (err, decoded) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    return res.status(401).json({
                        success: false,
                        message: "Refresh token expired, please login again"
                    });
                }
                return res.status(401).json({
                    success: false,
                    message: "Invalid refresh token"
                });
            }

            const { _id } = decoded;
            const user = await userSchema.findById(_id);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            // New access token
            const newAccessToken = jwt.sign(
                { _id: user._id },
                process.env.secretKey,
                { expiresIn: "7d" }
            );

            return res.status(200).json({
                success: true,
                message: "New access token generated",
                accessToken: newAccessToken
            });
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


//logout 
export const userLogout = async (req, res) => {

    try {
        const existing = await sessionSchema.findOne({ userId: req.userId })
        const user = await userSchema.findById(req.userId);
        if (existing) {
            await sessionSchema.findOneAndDelete({userId: req.userId})
            user.isLoggedin = false;
            await user.save();
            return res.status(200).json({
                success: true,
                message: "Sessions successfully ended",
            })
        }
        else {
            return res.status(404).json({
                success: false,
                message: "User had no sessions"
            })
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    };
};


