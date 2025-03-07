import { Router } from 'express';
import authRoutes from '@/routes/auth.routes';
import meditationRoutes from '@/routes/meditation.routes';
import sutraRoutes from '@/routes/sutra.routes';
import conversationRoutes from '@/routes/conversation.routes';
import worshipRoutes from '@/routes/worship.routes';
import permissionRoutes from '@/routes/permission.routes';
import userRoutes from '@/routes/user.routes';
import assetRoutes from '@/routes/asset.routes';

const router = Router();

// API 版本控制
const API_VERSION = '/api/v1';

// 注册所有路由
router.use(`${API_VERSION}/auth`, authRoutes);
router.use(`${API_VERSION}/meditation`, meditationRoutes);
router.use(`${API_VERSION}/sutras`, sutraRoutes);
router.use(`${API_VERSION}/conversations`, conversationRoutes);
router.use(`${API_VERSION}/worship`, worshipRoutes);
router.use(`${API_VERSION}/permissions`, permissionRoutes);
router.use(`${API_VERSION}/users`, userRoutes);
router.use(`${API_VERSION}/assets`, assetRoutes);

export default router; 