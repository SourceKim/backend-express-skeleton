import { Router } from 'express';
import { SutraController } from '@/controllers/sutra.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';

const router = Router();
const controller = new SutraController();

// 路由配置
router.get('/', controller.getSutras);
router.get('/:id', controller.getSutraById);
router.post('/', authMiddleware, controller.createSutra);
router.put('/:id', authMiddleware, controller.updateSutra);
router.delete('/:id', authMiddleware, controller.deleteSutra);

export default router; 