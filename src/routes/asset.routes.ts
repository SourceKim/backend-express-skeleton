import { Router } from 'express';
import { AssetController } from '@/controllers/asset.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';

const router = Router();
const controller = new AssetController();

// 路由配置
router.get('/', controller.getAssets);
router.get('/:id', controller.getAssetById);
router.post('/upload', authMiddleware, controller.uploadAsset);
router.put('/:id', authMiddleware, controller.updateAsset);
router.delete('/:id', authMiddleware, controller.deleteAsset);

export default router; 