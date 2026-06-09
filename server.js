import express from "express"
import { dbConnect } from "./src/config/dbConnect.js";
import userRoute from "./src/routers/userRoute.js";
import dotenv from "dotenv/config";
import noteRoute from "./src/routers/noteRoute.js";

const app = express();
const port = process.env.PORT

dbConnect()
app.use(express.json());
app.use('/user', userRoute);
app.use('/note', noteRoute);

app.listen(port, () => {
    console.log(`Server is running at: ${port}`);
});