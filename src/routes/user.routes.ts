import { Router } from 'express';
import { UserController } from '@/controllers/user.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';

const router = Router();
const userController = new UserController();

/**
 * @swagger
 * /users:
 *   post:
 *     tags:
 *       - 用户管理
 *     summary: 创建用户
 *     description: 创建新用户
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: 用户名
 *               password:
 *                 type: string
 *                 description: 密码
 *               email:
 *                 type: string
 *                 format: email
 *                 description: 邮箱
 *               phone:
 *                 type: string
 *                 description: 手机号
 *               nickname:
 *                 type: string
 *                 description: 昵称
 *               avatar:
 *                 type: string
 *                 description: 头像URL
 *               bio:
 *                 type: string
 *                 description: 用户简介
 *               roles:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: 角色ID列表
 */
router.post('/', authMiddleware, userController.createUser);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     tags:
 *       - 用户管理
 *     summary: 更新用户
 *     description: 更新用户信息
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 用户ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               nickname:
 *                 type: string
 *               avatar:
 *                 type: string
 *               bio:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE, BANNED]
 *               roles:
 *                 type: array
 *                 items:
 *                   type: string
 *               isActive:
 *                 type: boolean
 */
router.put('/:id', authMiddleware, userController.updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     tags:
 *       - 用户管理
 *     summary: 删除用户
 *     description: 删除指定用户
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 用户ID
 */
router.delete('/:id', authMiddleware, userController.deleteUser);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags:
 *       - 用户管理
 *     summary: 获取用户信息
 *     description: 获取指定用户的详细信息
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 用户ID
 */
router.get('/:id', authMiddleware, userController.getUser);

/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - 用户管理
 *     summary: 获取用户列表
 *     description: 获取用户列表，支持分页和筛选
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: 页码
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: 每页数量
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *         description: 用户名搜索
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: 邮箱搜索
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, INACTIVE, BANNED]
 *         description: 用户状态
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: 是否激活
 */
router.get('/', authMiddleware, userController.getUsers);

export default router; 