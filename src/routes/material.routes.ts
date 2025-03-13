import { Router } from 'express';
import { MaterialController } from '@/controllers/material.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { adminMiddleware } from '@/middlewares/admin.middleware';

const router = Router();
const controller = new MaterialController();

// 公开 API - 不需要认证
router.get('/', controller.getMaterials);
router.get('/:id', controller.getMaterialById);
router.get('/:id/related', controller.getRelatedMaterials);
router.get('/:id/versions', controller.getMaterialVersions);

// 需要认证的 API - 普通用户可以操作
router.post('/upload', authMiddleware, controller.uploadMaterial);
router.post('/upload/batch', authMiddleware, controller.uploadMaterialsBatch);
router.post('/text', authMiddleware, controller.createTextMaterial);

// 管理员 API - 需要管理员权限
router.use('/admin', authMiddleware, adminMiddleware);
router.put('/admin/:id', controller.updateMaterial);
router.delete('/admin/:id', controller.deleteMaterial);
router.post('/admin/batch/delete', controller.batchDeleteMaterials);

export default router; 