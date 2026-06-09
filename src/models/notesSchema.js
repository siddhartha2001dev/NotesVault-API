import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    note: {
        type: String,
        required: true
    },

    isPinned: {
        type: Boolean,
        default: false
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    }

}, { timestamps: true })

export default mongoose.model('note', noteSchema);