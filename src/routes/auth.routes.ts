import { Router } from 'express';
import { AuthController } from '@/controllers/auth.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';

const router = Router();
const authController = new AuthController();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/token-login', authController.tokenLogin);
router.get('/profile', authMiddleware, authController.getProfile);

export default router; 