import { Router } from 'express';
import { UserController } from '@/controllers/user.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';

const router = Router();
const userController = new UserController();

router.post('/', authMiddleware, userController.createUser);

router.put('/:id', authMiddleware, userController.updateUser);

router.delete('/:id', authMiddleware, userController.deleteUser);

router.get('/:id', authMiddleware, userController.getUser);

router.get('/', authMiddleware, userController.getUsers);

export default router; 