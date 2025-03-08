/**
 * @swagger
 * tags:
 *   name: UserSettings
 *   description: 用户设置相关 API
 */

/**
 * @swagger
 * /users/{userId}/settings:
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
 *         description: 用户ID
 *     responses:
 *       200:
 *         description: 成功获取用户设置
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
 *                   example: "success"
 *                 data:
 *                   $ref: '#/components/schemas/UserSettings'
 *                 error:
 *                   type: object
 *                   nullable: true
 *       401:
 *         description: 未授权
 *       404:
 *         description: 用户设置不存在
 *       500:
 *         description: 服务器错误
 *
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
 *         description: 用户ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserSettingsDto'
 *     responses:
 *       200:
 *         description: 成功更新用户设置
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
 *                   example: "success"
 *                 data:
 *                   $ref: '#/components/schemas/UserSettings'
 *                 error:
 *                   type: object
 *                   nullable: true
 *       400:
 *         description: 请求参数错误
 *       401:
 *         description: 未授权
 *       404:
 *         description: 用户设置不存在
 *       500:
 *         description: 服务器错误
 */

/**
 * @swagger
 * /users/{userId}/settings/theme:
 *   patch:
 *     summary: 更新用户主题设置
 *     tags: [UserSettings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
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
 *             required:
 *               - theme
 *             properties:
 *               theme:
 *                 type: string
 *                 enum: [light, dark, system]
 *                 description: 主题设置
 *     responses:
 *       200:
 *         description: 成功更新主题设置
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
 *                   example: "success"
 *                 data:
 *                   $ref: '#/components/schemas/UserSettings'
 *                 error:
 *                   type: object
 *                   nullable: true
 *       400:
 *         description: 请求参数错误
 *       401:
 *         description: 未授权
 *       404:
 *         description: 用户设置不存在
 *       500:
 *         description: 服务器错误
 */

/**
 * @swagger
 * /users/{userId}/settings/language:
 *   patch:
 *     summary: 更新用户语言设置
 *     tags: [UserSettings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
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
 *             required:
 *               - language
 *             properties:
 *               language:
 *                 type: string
 *                 enum: [zh-CN, en-US]
 *                 description: 语言设置
 *     responses:
 *       200:
 *         description: 成功更新语言设置
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
 *                   example: "success"
 *                 data:
 *                   $ref: '#/components/schemas/UserSettings'
 *                 error:
 *                   type: object
 *                   nullable: true
 *       400:
 *         description: 请求参数错误
 *       401:
 *         description: 未授权
 *       404:
 *         description: 用户设置不存在
 *       500:
 *         description: 服务器错误
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserSettings:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: 设置ID
 *         user_id:
 *           type: string
 *           format: uuid
 *           description: 用户ID
 *         theme:
 *           type: string
 *           enum: [light, dark, system]
 *           description: 主题设置
 *         language:
 *           type: string
 *           enum: [zh-CN, en-US]
 *           description: 语言设置
 *         notifications_enabled:
 *           type: boolean
 *           description: 是否启用通知
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: 创建时间
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: 更新时间
 *
 *     UpdateUserSettingsDto:
 *       type: object
 *       properties:
 *         theme:
 *           type: string
 *           enum: [light, dark, system]
 *           description: 主题设置
 *         language:
 *           type: string
 *           enum: [zh-CN, en-US]
 *           description: 语言设置
 *         notifications_enabled:
 *           type: boolean
 *           description: 是否启用通知
 */ 