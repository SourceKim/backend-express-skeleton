import { Router } from 'express';
import { AssetController } from '@/controllers/asset.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { adminMiddleware } from '@/middlewares/admin.middleware';

const router = Router();
const controller = new AssetController();

// 公开API - 不需要认证
router.get('/', controller.getAssets);
router.get('/:id', controller.getAssetById);

// 需要认证的API - 普通用户可以上传资源
router.post('/upload', authMiddleware, controller.uploadAsset);

// 管理员API - 需要管理员权限
router.use('/admin', authMiddleware, adminMiddleware);
router.put('/admin/:id', controller.updateAsset); // 更新资源信息
router.delete('/admin/:id', controller.deleteAsset); // 删除资源

export default router; 