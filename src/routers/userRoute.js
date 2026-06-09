import express from "express";
import { refreshToken, userLogin, userLogout, userRegister } from "../controllers/userController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { hashToken } from "../middleware/hashToken.js";
import { userValidateSchema, validateUser } from "../validators/userValidate.js";

const userRoute = express.Router();

userRoute.post('/register', validateUser(userValidateSchema), userRegister);
userRoute.get('/verify', verifyToken);
userRoute.post('/login', userLogin);
userRoute.post('/refreshToken', refreshToken);
userRoute.delete('/logOut', hashToken, userLogout);

export default userRoute