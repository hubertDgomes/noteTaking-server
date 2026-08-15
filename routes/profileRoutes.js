import express from 'express';
import {
  signUpController,
  logInController,
  getProfileController
} from '../controller/profile.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', signUpController);
router.post('/login', logInController);
router.get('/profile', authenticateUser, getProfileController);

export default router;
