import express from "express";
import { createNote, delAllNotes, deleteNote, getAllNotes, noteSearch, paginateNotes, pinNote, updateNote } from "../controllers/notesController.js";
import { hashToken } from "../middleware/hashToken.js";

const noteRoute = express.Router()

noteRoute.post('/create', hashToken, createNote);
noteRoute.get('/get', hashToken, getAllNotes);
noteRoute.delete('/del/:id', hashToken, deleteNote);
noteRoute.delete('/del-all', hashToken, delAllNotes);
noteRoute.patch('/update/:id', hashToken, updateNote);
noteRoute.patch('/pin/:id', hashToken, pinNote);
noteRoute.get('/paginate', hashToken, paginateNotes);
noteRoute.get('/search', hashToken, noteSearch);

export default noteRoute;