import express from 'express';
import {
  createNote,
  getUserNotes,
  getAllNotes,
  getNote,
  updateNote,
  deleteNote
} from '../controller/noteController.js';
import { authenticateUser, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/createNote', authenticateUser, createNote);
router.get('/notes', authenticateUser, getUserNotes);
router.get('/notes/all', authenticateUser, authorizeAdmin, getAllNotes);
router.get('/notes/:noteId', authenticateUser, getNote);
router.put('/notes/:noteId', authenticateUser, updateNote);
router.delete('/notes/:noteId', authenticateUser, deleteNote);

export default router;
