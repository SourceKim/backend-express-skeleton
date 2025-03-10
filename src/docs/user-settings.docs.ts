/**
 * @swagger
 * /user-settings/profile/settings:
 *   get:
 *     tags:
 *       - UserSettings
 *     summary: 获取当前用户设置
 *     description: 获取当前登录用户的设置信息
 *     security:
 *       - BearerAuth: []
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
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/UserSettingsResponseDto'
 *                 error:
 *                   type: object
 *                   nullable: true
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 *   
 *   post:
 *     tags:
 *       - UserSettings
 *     summary: 创建当前用户设置
 *     description: 为当前登录用户创建设置信息
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserSettingsDto'
 *     responses:
 *       201:
 *         description: 用户设置创建成功
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
 *                   $ref: '#/components/schemas/UserSettingsResponseDto'
 *                 error:
 *                   type: object
 *                   nullable: true
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 *   
 *   put:
 *     tags:
 *       - UserSettings
 *     summary: 更新当前用户设置
 *     description: 更新当前登录用户的设置信息
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserSettingsDto'
 *     responses:
 *       200:
 *         description: 用户设置更新成功
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
 *                   $ref: '#/components/schemas/UserSettingsResponseDto'
 *                 error:
 *                   type: object
 *                   nullable: true
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 *   
 *   delete:
 *     tags:
 *       - UserSettings
 *     summary: 删除当前用户设置
 *     description: 删除当前登录用户的设置信息
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 用户设置删除成功
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
 *                 error:
 *                   type: object
 *                   nullable: true
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */

/**
 * @swagger
 * /user-settings/admin/{userId}/settings:
 *   get:
 *     tags:
 *       - UserSettings(admin)
 *     summary: 获取指定用户设置
 *     description: 管理员获取指定用户的设置信息
 *     security:
 *       - BearerAuth: []
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
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/UserSettingsResponseDto'
 *                 error:
 *                   type: object
 *                   nullable: true
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: 没有管理员权限
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 *   
 *   post:
 *     tags:
 *       - UserSettings(admin)
 *     summary: 创建指定用户设置
 *     description: 管理员为指定用户创建设置信息
 *     security:
 *       - BearerAuth: []
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
 *             $ref: '#/components/schemas/CreateUserSettingsDto'
 *     responses:
 *       201:
 *         description: 用户设置创建成功
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
 *                   $ref: '#/components/schemas/UserSettingsResponseDto'
 *                 error:
 *                   type: object
 *                   nullable: true
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: 没有管理员权限
 *       500:
 *         $ref: '#/components/responses/InternalError'
 *   
 *   put:
 *     tags:
 *       - UserSettings(admin)
 *     summary: 更新指定用户设置
 *     description: 管理员更新指定用户的设置信息
 *     security:
 *       - BearerAuth: []
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
 *         description: 用户设置更新成功
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
 *                   $ref: '#/components/schemas/UserSettingsResponseDto'
 *                 error:
 *                   type: object
 *                   nullable: true
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: 没有管理员权限
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 *   
 *   delete:
 *     tags:
 *       - UserSettings(admin)
 *     summary: 删除指定用户设置
 *     description: 管理员删除指定用户的设置信息
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: 用户ID
 *     responses:
 *       200:
 *         description: 用户设置删除成功
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
 *                 error:
 *                   type: object
 *                   nullable: true
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: 没有管理员权限
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserSettingsResponseDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: 设置ID
 *         theme:
 *           type: string
 *           description: 主题设置
 *         language:
 *           type: string
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
 *     CreateUserSettingsDto:
 *       type: object
 *       required:
 *         - theme
 *         - language
 *         - notifications_enabled
 *       properties:
 *         theme:
 *           type: string
 *           description: 主题设置
 *         language:
 *           type: string
 *           description: 语言设置
 *         notifications_enabled:
 *           type: boolean
 *           description: 是否启用通知
 *
 *     UpdateUserSettingsDto:
 *       type: object
 *       properties:
 *         theme:
 *           type: string
 *           description: 主题设置
 *         language:
 *           type: string
 *           description: 语言设置
 *         notifications_enabled:
 *           type: boolean
 *           description: 是否启用通知
 */ 