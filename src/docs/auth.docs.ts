/**
 * @swagger
 * components:
 *   schemas:
 *     UserStatus:
 *       type: string
 *       enum: [active, inactive, banned]
 *       description: 用户状态
 *
 *     RegisterDto:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: 用户名
 *           example: johndoe
 *         password:
 *           type: string
 *           format: password
 *           description: 密码
 *           example: P@ssw0rd
 *         email:
 *           type: string
 *           format: email
 *           description: 邮箱
 *           example: john@example.com
 *         phone:
 *           type: string
 *           description: 手机号
 *           example: 13800138000
 *         nickname:
 *           type: string
 *           description: 昵称
 *           example: John Doe
 *         avatar:
 *           type: string
 *           description: 头像URL
 *           example: https://example.com/avatar.jpg
 *         bio:
 *           type: string
 *           description: 个人简介
 *           example: 这是我的个人简介
 *       required:
 *         - username
 *         - password
 *
 *     LoginDto:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: 用户名
 *           example: johndoe
 *         password:
 *           type: string
 *           format: password
 *           description: 密码
 *           example: P@ssw0rd
 *       required:
 *         - username
 *         - password
 *
 *     RegisterResponseDto:
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
 *         phone:
 *           type: string
 *           description: 手机号
 *           example: 13800138000
 *         nickname:
 *           type: string
 *           description: 昵称
 *           example: John Doe
 *         avatar:
 *           type: string
 *           description: 头像URL
 *           example: https://example.com/avatar.jpg
 *         bio:
 *           type: string
 *           description: 个人简介
 *           example: 这是我的个人简介
 *         status:
 *           $ref: '#/components/schemas/UserStatus'
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *       required:
 *         - id
 *         - username
 *         - status
 *         - created_at
 *         - updated_at
 *         - roles
 *
 *     LoginResponseDto:
 *       type: object
 *       properties:
 *         access_token:
 *           type: string
 *           description: JWT访问令牌
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *               description: 用户ID
 *               example: 550e8400-e29b-41d4-a716-446655440000
 *             username:
 *               type: string
 *               description: 用户名
 *               example: johndoe
 *             email:
 *               type: string
 *               format: email
 *               description: 邮箱
 *               example: john@example.com
 *             phone:
 *               type: string
 *               description: 手机号
 *               example: 13800138000
 *             nickname:
 *               type: string
 *               description: 昵称
 *               example: John Doe
 *             avatar:
 *               type: string
 *               description: 头像URL
 *               example: https://example.com/avatar.jpg
 *             bio:
 *               type: string
 *               description: 个人简介
 *               example: 这是我的个人简介
 *             status:
 *               $ref: '#/components/schemas/UserStatus'
 *             roles:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *       required:
 *         - access_token
 *         - user
 *
 *     ProfileResponseDto:
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
 *         phone:
 *           type: string
 *           description: 手机号
 *           example: 13800138000
 *         nickname:
 *           type: string
 *           description: 昵称
 *           example: John Doe
 *         avatar:
 *           type: string
 *           description: 头像URL
 *           example: https://example.com/avatar.jpg
 *         bio:
 *           type: string
 *           description: 个人简介
 *           example: 这是我的个人简介
 *         status:
 *           $ref: '#/components/schemas/UserStatus'
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *       required:
 *         - id
 *         - username
 *         - status
 *         - created_at
 *         - updated_at
 *         - roles
 *
 *     UpdateProfileDto:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: 邮箱
 *           example: john@example.com
 *         phone:
 *           type: string
 *           description: 手机号
 *           example: 13800138000
 *         nickname:
 *           type: string
 *           description: 昵称
 *           example: John Doe
 *         avatar:
 *           type: string
 *           description: 头像URL
 *           example: https://example.com/avatar.jpg
 *         bio:
 *           type: string
 *           description: 个人简介
 *           example: 这是我的个人简介
 *
 * paths:
 *   /auth/register:
 *     post:
 *       tags:
 *         - 认证
 *       summary: 用户注册
 *       description: 创建新用户账号
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterDto'
 *       responses:
 *         201:
 *           description: 成功注册用户
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/RegisterResponseDto'
 *         400:
 *           $ref: '#/components/responses/ValidationError'
 *         409:
 *           description: 用户名已存在
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiResponse'
 *               example:
 *                 code: 409
 *                 message: 用户名已存在
 *
 *   /auth/login:
 *     post:
 *       tags:
 *         - 认证
 *       summary: 用户登录
 *       description: 使用用户名和密码登录系统
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginDto'
 *       responses:
 *         200:
 *           description: 成功登录
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/LoginResponseDto'
 *         400:
 *           $ref: '#/components/responses/ValidationError'
 *         401:
 *           description: 用户名或密码错误
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiResponse'
 *               example:
 *                 code: 401
 *                 message: 用户名或密码错误
 *         403:
 *           description: 账号已被禁用
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiResponse'
 *               example:
 *                 code: 403
 *                 message: 账号已被禁用
 *
 *   /auth/profile:
 *     get:
 *       tags:
 *         - 认证
 *       summary: 获取当前用户资料
 *       description: 获取当前登录用户的详细资料
 *       security:
 *         - BearerAuth: []
 *       responses:
 *         200:
 *           description: 成功获取用户资料
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/ProfileResponseDto'
 *         401:
 *           $ref: '#/components/responses/UnauthorizedError'
 */ 