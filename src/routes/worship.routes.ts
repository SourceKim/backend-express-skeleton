import { Router } from 'express';
import { WorshipController } from '@/controllers/worship.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';

const router = Router();
const controller = new WorshipController();

// 上香素材相关路由
router.get(
  '/materials', 
  authMiddleware, 
  controller.getMaterials
);

router.post(
  '/materials', 
  authMiddleware, 
  controller.createMaterial
);

router.get(
  '/materials/:id', 
  authMiddleware, 
  controller.getMaterialById
);

router.put(
  '/materials/:id', 
  authMiddleware, 
  controller.updateMaterial
);

router.delete(
  '/materials/:id', 
  authMiddleware, 
  controller.deleteMaterial
);

// 上香记录相关路由
router.post(
  '/record', 
  authMiddleware, 
  controller.createRecord
);

router.get(
  '/records', 
  authMiddleware, 
  controller.getRecords
);

router.get(
  '/record/:id', 
  authMiddleware, 
  controller.getRecordById
);

router.put(
  '/record/:id', 
  authMiddleware, 
  controller.updateRecord
);

router.delete(
  '/record/:id', 
  authMiddleware, 
  controller.deleteRecord
);

// 上香排名
router.get(
  '/ranking', 
  authMiddleware, 
  controller.getRanking
);

export default router; 