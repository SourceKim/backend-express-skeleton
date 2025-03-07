import { Router } from 'express';
import { MeditationController } from '@/controllers/meditation.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';

const router = Router();
const meditationController = new MeditationController();

// 获取冥想素材列表
router.get(
  '/materials',
  authMiddleware,
  meditationController.getMaterials
);

// 创建冥想素材
router.post(
  '/materials',
  authMiddleware,
  meditationController.createMaterial
);

// 获取单个冥想素材
router.get(
  '/materials/:id',
  authMiddleware,
  meditationController.getMaterialById
);

// 更新冥想素材
router.put(
  '/materials/:id',
  authMiddleware,
  meditationController.updateMaterial
);

// 删除冥想素材
router.delete(
  '/materials/:id',
  authMiddleware,
  meditationController.deleteMaterial
);

// 开始冥想
router.post(
  '/start',
  authMiddleware,
  meditationController.startMeditation
);

// 结束冥想
router.post(
  '/end',
  authMiddleware,
  meditationController.endMeditation
);

// 获取冥想记录
router.get(
  '/records',
  authMiddleware,
  meditationController.getRecords
);

// 获取进行中的冥想
router.get(
  '/ongoing',
  authMiddleware,
  meditationController.getOngoingMeditation
);

export default router; 