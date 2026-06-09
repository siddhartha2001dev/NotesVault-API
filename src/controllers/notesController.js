import notesSchema from "../models/notesSchema.js";
import userSchema from "../models/userSchema.js";


//Create new Note
export const createNote = async (req, res) => {

    try {
        const { title, note } = req.body;
        const newNote = await notesSchema.create({ title, note, userId: req.userId })
        return res.status(200).json({
            success: true,
            message: "New note created",
            data: newNote
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

//Read notes
export const getAllNotes = async (req, res) => {

    try {
        const readNotes = await notesSchema.find({ userId: req.userId })
        return res.status(200).json({
            success: true,
            message: "Notes fetched successfully",
            data: readNotes
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    };
};


//Delete Note
export const deleteNote = async (req, res) => {

    try {

        const noteId = req.params.id;
        const user = await userSchema.findById(req.userId)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        else {
            const delNote = await notesSchema.findOneAndDelete({ _id: noteId, userId: user._id })
            if (!delNote) {
                return res.status(404).json({
                    success: false,
                    message: "Note not found"
                })
            }
            return res.status(200).json({
                success: true,
                message: "Note deleted successfully",
                data: delNote
            });
        };

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    };
};


//Delete All Notes 
export const delAllNotes = async (req, res) => {

    try {
        const deletedNotes = await notesSchema.deleteMany({ userId: req.userId });
        return res.status(200).json({
            success: true,
            message: `${deletedNotes.deletedCount} notes deleted successfully`,
            data: deletedNotes
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    };
};


//Update notes 
export const updateNote = async (req, res) => {

    try {
        const noteId = req.params.id;
        const { title, note } = req.body;

        const user = await userSchema.findById(req.userId)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        else {
            const newNote = await notesSchema.findOneAndUpdate({ userId: req.userId, _id: noteId }, { title, note }, { new: true })
            if (!newNote) {
                return res.status(404).json({
                    success: false,
                    message: "Note not found"
                });
            };

            return res.status(200).json({
                success: true,
                message: "Note updated successfully"
            });

        };
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    };
};



//pinNotes
export const pinNote = async (req, res) => {

    try {
        const noteId = req.params.id

        const user = await userSchema.findById(req.userId)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        const note = await notesSchema.findOne({ userId: req.userId, _id: noteId })
        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            })
        }

        const updateNote = await notesSchema.findOneAndUpdate({ _id: noteId, userId: req.userId }, { isPinned: !note.isPinned }, { new: true })

        return res.status(200).json({
            success: true,
            message: updateNote.isPinned ? "Note Pinned" : "Note unpinned",
            data: updateNote
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    };
};



//paginated notes
export const paginateNotes = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 4;

        const skip = (page - 1) * limit;

        const totalNotes = await notesSchema.countDocuments({ userId: req.userId });

        const notes = await notesSchema
            .find({ userId: req.userId })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            message: "Notes fetched as per query",
            data: notes,
            currentPage: page,
            totalPages: Math.ceil(totalNotes / limit),
            totalNotes: totalNotes
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    };
};


//Keyword notes Search 
export const noteSearch = async (req, res) => {

    try {
        const keyword = req.query.keyword;

        const notes = await notesSchema.find({
            userId: req.userId, $or: [{
                title: {

                    $regex: keyword,
                    $options: "i"
                }
            }, {
                note: {
                    $regex: keyword,
                    $options: "i"
                }
            }]
        });

        return res.status(200).json({
            success: true,
            message: "Note fetched",
            data: notes
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    };
};
