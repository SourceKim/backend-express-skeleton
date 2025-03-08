/**
 * @swagger
 * tags:
 *   name: UserSettings
 *   description: 用户设置相关 API
 */

/**
 * @swagger
 * /api/v1/users/{userId}/settings:
 *   get:
 *     summary: 获取用户设置
 *     tags: [UserSettings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: 用户 ID
 *     responses:
 *       200:
 *         description: 获取成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     theme:
 *                       type: string
 *                     language:
 *                       type: string
 *                     notifications_enabled:
 *                       type: boolean
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: 未授权
 *       404:
 *         description: 用户设置不存在
 */

/**
 * @swagger
 * /api/v1/users/{userId}/settings:
 *   post:
 *     summary: 创建用户设置
 *     tags: [UserSettings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: 用户 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - theme
 *               - language
 *               - notifications_enabled
 *             properties:
 *               theme:
 *                 type: string
 *                 description: 主题
 *               language:
 *                 type: string
 *                 description: 语言
 *               notifications_enabled:
 *                 type: boolean
 *                 description: 是否启用通知
 *     responses:
 *       201:
 *         description: 创建成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: 用户设置创建成功
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     theme:
 *                       type: string
 *                     language:
 *                       type: string
 *                     notifications_enabled:
 *                       type: boolean
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: 请求参数错误
 *       401:
 *         description: 未授权
 *       404:
 *         description: 用户不存在
 */

/**
 * @swagger
 * /api/v1/users/{userId}/settings:
 *   put:
 *     summary: 更新用户设置
 *     tags: [UserSettings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: 用户 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               theme:
 *                 type: string
 *                 description: 主题
 *               language:
 *                 type: string
 *                 description: 语言
 *               notifications_enabled:
 *                 type: boolean
 *                 description: 是否启用通知
 *     responses:
 *       200:
 *         description: 更新成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: 用户设置更新成功
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     theme:
 *                       type: string
 *                     language:
 *                       type: string
 *                     notifications_enabled:
 *                       type: boolean
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: 请求参数错误
 *       401:
 *         description: 未授权
 *       404:
 *         description: 用户设置不存在
 */

/**
 * @swagger
 * /api/v1/users/{userId}/settings:
 *   delete:
 *     summary: 删除用户设置
 *     tags: [UserSettings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: 用户 ID
 *     responses:
 *       200:
 *         description: 删除成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: 用户设置删除成功
 *                 data:
 *                   type: null
 *       401:
 *         description: 未授权
 *       404:
 *         description: 用户设置不存在
 */ 