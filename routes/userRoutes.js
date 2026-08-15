import express from 'express';
import {
  listUsers,
  updateUser,
  deleteUser,
  usersByInterest,
  userPosts
} from '../controller/userController.js';

const router = express.Router();

router.get('/users', listUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/users/by-interest', usersByInterest);
router.get('/users/:id/posts', userPosts);

export default router;
