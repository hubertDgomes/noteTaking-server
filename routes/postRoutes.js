import express from 'express';
import { createPost } from '../controller/postController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

router.post('/posts', authenticateUser, createPost);

export default router;
