/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags:
 *       - 认证
 *     summary: 用户注册
 *     description: 创建新用户账号
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - email
 *             properties:
 *               username:
 *                 type: string
 *                 description: 用户名
 *                 minLength: 3
 *                 maxLength: 100
 *               password:
 *                 type: string
 *                 description: 密码
 *                 minLength: 6
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
 *                 maxLength: 500
 *     responses:
 *       200:
 *         description: 注册成功
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
 *                   $ref: '#/components/schemas/UserResponseDto'
 *                 error:
 *                   type: object
 *                   nullable: true
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       409:
 *         description: 用户名或邮箱已存在
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - 认证
 *     summary: 用户登录
 *     description: 使用用户名和密码登录
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
 *     responses:
 *       200:
 *         description: 登录成功
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
 *                     token:
 *                       type: string
 *                       description: JWT令牌
 *                     user:
 *                       $ref: '#/components/schemas/UserResponseDto'
 *                 error:
 *                   type: object
 *                   nullable: true
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         description: 用户名或密码错误
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     tags:
 *       - 认证
 *     summary: 刷新令牌
 *     description: 使用刷新令牌获取新的访问令牌
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 令牌刷新成功
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
 *                     token:
 *                       type: string
 *                       description: 新的JWT令牌
 *                 error:
 *                   type: object
 *                   nullable: true
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags:
 *       - 认证
 *     summary: 用户登出
 *     description: 使当前令牌失效
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 登出成功
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
 *                   nullable: true
 *                 error:
 *                   type: object
 *                   nullable: true
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     tags:
 *       - 认证
 *     summary: 忘记密码
 *     description: 发送密码重置邮件
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: 用户注册邮箱
 *     responses:
 *       200:
 *         description: 密码重置邮件发送成功
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
 *                   nullable: true
 *                 error:
 *                   type: object
 *                   nullable: true
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         description: 邮箱不存在
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     tags:
 *       - 认证
 *     summary: 重置密码
 *     description: 使用重置令牌设置新密码
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *             properties:
 *               token:
 *                 type: string
 *                 description: 密码重置令牌
 *               password:
 *                 type: string
 *                 description: 新密码
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: 密码重置成功
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
 *                   nullable: true
 *                 error:
 *                   type: object
 *                   nullable: true
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         description: 无效或过期的令牌
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */

/**
 * @swagger
 * /auth/change-password:
 *   post:
 *     tags:
 *       - 认证
 *     summary: 修改密码
 *     description: 已登录用户修改密码
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: 当前密码
 *               newPassword:
 *                 type: string
 *                 description: 新密码
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: 密码修改成功
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
 *                   nullable: true
 *                 error:
 *                   type: object
 *                   nullable: true
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */

/**
 * @swagger
 * /auth/me:
 *   get:
 *     tags:
 *       - 认证
 *     summary: 获取当前用户信息
 *     description: 获取当前登录用户的详细信息
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 成功获取用户信息
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
 *                   $ref: '#/components/schemas/UserResponseDto'
 *                 error:
 *                   type: object
 *                   nullable: true
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   responses:
 *     BadRequest:
 *       description: 请求参数错误
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: number
 *                 example: 400
 *               message:
 *                 type: string
 *                 example: 请求参数错误
 *               data:
 *                 type: object
 *                 nullable: true
 *               error:
 *                 type: object
 *     Unauthorized:
 *       description: 未授权
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: number
 *                 example: 401
 *               message:
 *                 type: string
 *                 example: 未授权
 *               data:
 *                 type: object
 *                 nullable: true
 *               error:
 *                 type: object
 *     Forbidden:
 *       description: 禁止访问
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: number
 *                 example: 403
 *               message:
 *                 type: string
 *                 example: 禁止访问
 *               data:
 *                 type: object
 *                 nullable: true
 *               error:
 *                 type: object
 *     NotFound:
 *       description: 资源不存在
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: number
 *                 example: 404
 *               message:
 *                 type: string
 *                 example: 资源不存在
 *               data:
 *                 type: object
 *                 nullable: true
 *               error:
 *                 type: object
 *     InternalError:
 *       description: 服务器内部错误
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: number
 *                 example: 500
 *               message:
 *                 type: string
 *                 example: 服务器内部错误
 *               data:
 *                 type: object
 *                 nullable: true
 *               error:
 *                 type: object
 */ 