/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - 用户
 *     summary: 获取用户列表
 *     description: 获取用户集合，支持分页和筛选
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 页码
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 每页数量
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *         description: 用户名
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: 邮箱
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: 用户状态
 *       - in: query
 *         name: is_active
 *         schema:
 *           type: boolean
 *         description: 是否激活
 *     responses:
 *       200:
 *         description: 成功获取用户列表
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
 *                   allOf:
 *                     - $ref: '#/components/schemas/PaginatedResponse'
 *                     - type: object
 *                       properties:
 *                         items:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/UserResponseDto'
 *                 error:
 *                   type: object
 *                   nullable: true
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 * 
 *   post:
 *     tags:
 *       - 用户
 *     summary: 创建用户
 *     description: 添加新的用户记录
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserDto'
 *     responses:
 *       201:
 *         description: 用户创建成功
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
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags:
 *       - 用户
 *     summary: 获取用户详情
 *     description: 获取指定用户的详细信息
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 用户ID
 *     responses:
 *       200:
 *         description: 成功获取用户详情
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
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 * 
 *   put:
 *     tags:
 *       - 用户
 *     summary: 更新用户
 *     description: 修改指定用户的信息
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
 *             $ref: '#/components/schemas/UpdateUserDto'
 *     responses:
 *       200:
 *         description: 用户更新成功
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
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateUserDto:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: 用户名
 *           minLength: 3
 *           maxLength: 100
 *         password:
 *           type: string
 *           description: 密码
 *           minLength: 6
 *         email:
 *           type: string
 *           format: email
 *           description: 邮箱
 *           nullable: true
 *         nickname:
 *           type: string
 *           description: 昵称
 *           minLength: 2
 *           maxLength: 100
 *           nullable: true
 *         phone:
 *           type: string
 *           description: 手机号
 *           pattern: '^1[3-9]\\d{9}$'
 *           nullable: true
 *         avatar:
 *           type: string
 *           description: 头像
 *           nullable: true
 *         bio:
 *           type: string
 *           description: 简介
 *           maxLength: 500
 *           nullable: true
 *         roles:
 *           type: array
 *           items:
 *             type: string
 *           description: 角色列表
 *           nullable: true
 *
 *     UpdateUserDto:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: 邮箱
 *           nullable: true
 *         nickname:
 *           type: string
 *           description: 昵称
 *           minLength: 2
 *           maxLength: 100
 *           nullable: true
 *         phone:
 *           type: string
 *           description: 手机号
 *           pattern: '^1[3-9]\\d{9}$'
 *           nullable: true
 *         avatar:
 *           type: string
 *           description: 头像
 *           nullable: true
 *         bio:
 *           type: string
 *           description: 简介
 *           maxLength: 500
 *           nullable: true
 *         status:
 *           type: string
 *           enum: ['ACTIVE', 'INACTIVE', 'BANNED']
 *           description: 用户状态
 *           nullable: true
 *         is_active:
 *           type: boolean
 *           description: 是否激活
 *           nullable: true
 *         roles:
 *           type: array
 *           items:
 *             type: string
 *           description: 角色列表
 *           nullable: true
 *
 *     UserResponseDto:
 *       type: object
 *       required:
 *         - id
 *         - username
 *         - status
 *         - is_active
 *         - created_at
 *         - updated_at
 *         - roles
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: 用户ID
 *         username:
 *           type: string
 *           description: 用户名
 *         email:
 *           type: string
 *           format: email
 *           description: 邮箱
 *           nullable: true
 *         nickname:
 *           type: string
 *           description: 昵称
 *           nullable: true
 *         phone:
 *           type: string
 *           description: 手机号
 *           nullable: true
 *         avatar:
 *           type: string
 *           description: 头像
 *           nullable: true
 *         status:
 *           type: string
 *           enum: ['ACTIVE', 'INACTIVE', 'BANNED']
 *           description: 用户状态
 *         bio:
 *           type: string
 *           description: 简介
 *           nullable: true
 *         is_active:
 *           type: boolean
 *           description: 是否激活
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
 *                 description: 角色ID
 *               name:
 *                 type: string
 *                 description: 角色名称
 *               description:
 *                 type: string
 *                 description: 角色描述
 *                 nullable: true
 *           description: 角色列表
 *
 *     UserListResponseDto:
 *       allOf:
 *         - $ref: '#/components/schemas/PaginatedResponse'
 *         - type: object
 *           properties:
 *             items:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserResponseDto'
 */ 