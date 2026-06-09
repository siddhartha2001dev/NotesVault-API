import mongoose from "mongoose";

const url = "mongodb://localhost:27017/";

export async function dbConnect() {

    try {
        await mongoose.connect(url)
        console.log(`Mongo DB is connected successfully`);
    } catch (error) {
        console.log(`Connection error`, error);
    }
}