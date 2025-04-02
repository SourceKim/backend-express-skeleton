import { Router } from 'express';
import { MaterialController } from '@/controllers/material.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { adminMiddleware } from '@/middlewares/admin.middleware';

const router = Router();
const controller = new MaterialController();

// 公开 API - 不需要认证
router.get('/', authMiddleware, controller.getMaterials); // 获取所有素材，可选地传入分类和标签
router.get('/:id', authMiddleware, controller.getMaterialById); // 获取单个素材

// 管理员 API - 需要管理员权限
router.post('/admin/upload', authMiddleware, adminMiddleware, controller.uploadMaterial); // 上传素材
router.put('/admin/:id', authMiddleware, adminMiddleware, controller.updateMaterial); // 更新素材
router.delete('/admin/:id', authMiddleware, adminMiddleware, controller.deleteMaterial); // 删除素材

// 管理员分类管理API - CRUD
router.get('/admin/categories', authMiddleware, adminMiddleware, controller.getCategories);
router.post('/admin/categories', authMiddleware, adminMiddleware, controller.createCategory);
router.put('/admin/categories/:id', authMiddleware, adminMiddleware, controller.updateCategory);
router.delete('/admin/categories/:id', authMiddleware, adminMiddleware, controller.deleteCategory);

// 管理员标签管理API - CRUD
router.get('/admin/tags', authMiddleware, adminMiddleware, controller.getTags);
router.post('/admin/tags', authMiddleware, adminMiddleware, controller.createTag);
router.put('/admin/tags/:id', authMiddleware, adminMiddleware, controller.updateTag);
router.delete('/admin/tags/:id', authMiddleware, adminMiddleware, controller.deleteTag);

export default router; 