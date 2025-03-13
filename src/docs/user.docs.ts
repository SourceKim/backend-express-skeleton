/**
 * @swagger
 * components:
 *   schemas:
 *     UserStatus:
 *       type: string
 *       enum: [active, inactive, banned]
 *       description: 用户状态
 *
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: 用户ID
 *           example: 550e8400-e29b-41d4-a716-446655440000
 *         username:
 *           type: string
 *           description: 用户名
 *           example: johndoe
 *         email:
 *           type: string
 *           format: email
 *           description: 邮箱
 *           example: john@example.com
 *         nickname:
 *           type: string
 *           description: 昵称
 *           example: John Doe
 *         phone:
 *           type: string
 *           description: 手机号
 *           example: 13800138000
 *         avatar:
 *           type: string
 *           description: 头像URL
 *           example: https://example.com/avatar.jpg
 *         status:
 *           $ref: '#/components/schemas/UserStatus'
 *         bio:
 *           type: string
 *           description: 用户简介
 *           example: 这是我的个人简介
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: 创建时间
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: 更新时间
 *         roles:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *                 description: 角色ID
 *               name:
 *                 type: string
 *                 description: 角色名称
 *               description:
 *                 type: string
 *                 description: 角色描述
 *       required:
 *         - id
 *         - username
 *         - status
 *         - created_at
 *         - updated_at
 *
 *     UpdateUserDto:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: 邮箱
 *           example: john@example.com
 *         nickname:
 *           type: string
 *           description: 昵称
 *           example: John Doe
 *         phone:
 *           type: string
 *           description: 手机号
 *           example: 13800138000
 *         avatar:
 *           type: string
 *           description: 头像URL
 *           example: https://example.com/avatar.jpg
 *         bio:
 *           type: string
 *           description: 用户简介
 *           example: 这是我的个人简介
 *
 * paths:
 *   /users/profile:
 *     get:
 *       tags:
 *         - 用户
 *       summary: 获取当前用户信息
 *       description: 获取当前登录用户的详细信息
 *       security:
 *         - BearerAuth: []
 *       responses:
 *         200:
 *           description: 成功获取用户信息
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/User'
 *         401:
 *           $ref: '#/components/responses/UnauthorizedError'
 *
 *     put:
 *       tags:
 *         - 用户
 *       summary: 更新当前用户信息
 *       description: 更新当前登录用户的个人信息
 *       security:
 *         - BearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateUserDto'
 *       responses:
 *         200:
 *           description: 成功更新用户信息
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/User'
 *         400:
 *           $ref: '#/components/responses/ValidationError'
 *         401:
 *           $ref: '#/components/responses/UnauthorizedError'
 */ 