import { Router } from 'express';
import { Joi, Segments, celebrate } from 'celebrate';
import { authenticate } from '../middleware/authenticate.js';
import {
  getCurrentUser,
  updateCurrentUser,
  updateUserAvatar,
} from '../controllers/userController.js';
import { upload } from '../middleware/multer.js';

const router = Router();

router.get('/users/me', authenticate, getCurrentUser);

router.patch(
  '/users/me',
  authenticate,
  celebrate({
    [Segments.BODY]: Joi.object({
      username: Joi.string().trim().min(1).required(),
    }),
  }),
  updateCurrentUser,
);

router.patch(
  '/users/me/avatar',
  authenticate,
  upload.single('photo'),
  updateUserAvatar,
);

export default router;
