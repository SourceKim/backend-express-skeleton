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
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/UserResponseDto'
 *                     total:
 *                       type: number
 *                       description: 总记录数
 *                     page:
 *                       type: number
 *                       description: 当前页码
 *                     limit:
 *                       type: number
 *                       description: 每页数量
 *                     totalPages:
 *                       type: number
 *                       description: 总页数
 *                 error:
 *                   type: object
 *                   nullable: true
 *       500:
 *         $ref: '#/components/responses/InternalError'
 *   
 *   post:
 *     tags:
 *       - 用户
 *     summary: 创建用户
 *     description: 管理员创建新用户
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserDto'
 *     responses:
 *       200:
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
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       409:
 *         description: 用户名或邮箱已存在
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
 *     description: 获取指定用户ID的详细信息
 *     security:
 *       - BearerAuth: []
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
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 *   
 *   put:
 *     tags:
 *       - 用户
 *     summary: 更新用户
 *     description: 更新指定ID的用户信息
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
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       409:
 *         description: 用户名或邮箱已存在
 *       500:
 *         $ref: '#/components/responses/InternalError'
 *   
 *   delete:
 *     tags:
 *       - 用户
 *     summary: 删除用户
 *     description: 删除指定ID的用户
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 用户ID
 *     responses:
 *       200:
 *         description: 用户删除成功
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
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */

/**
 * @swagger
 * /users/{id}/status:
 *   patch:
 *     tags:
 *       - 用户
 *     summary: 更新用户状态
 *     description: 更新指定用户的状态（激活/禁用）
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
 *             required:
 *               - is_active
 *             properties:
 *               is_active:
 *                 type: boolean
 *                 description: 是否激活
 *     responses:
 *       200:
 *         description: 用户状态更新成功
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
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - username
 *         - email
 *         - status
 *         - isActive
 *       properties:
 *         id:
 *           type: string
 *           description: 用户ID
 *         username:
 *           type: string
 *           description: 用户名
 *         email:
 *           type: string
 *           format: email
 *           description: 邮箱
 *         phone:
 *           type: string
 *           description: 手机号
 *         nickname:
 *           type: string
 *           description: 昵称
 *         avatar:
 *           type: string
 *           description: 头像URL
 *         bio:
 *           type: string
 *           description: 用户简介
 *         status:
 *           type: string
 *           enum: [ACTIVE, INACTIVE, BANNED]
 *           description: 用户状态
 *         isActive:
 *           type: boolean
 *           description: 是否激活
 *         roles:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *           description: 用户角色
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: 创建时间
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: 更新时间
 *
 *     CreateUserDto:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: 用户名
 *         password:
 *           type: string
 *           description: 密码
 *         email:
 *           type: string
 *           format: email
 *           description: 邮箱
 *         phone:
 *           type: string
 *           description: 手机号
 *         nickname:
 *           type: string
 *           description: 昵称
 *         avatar:
 *           type: string
 *           description: 头像URL
 *         bio:
 *           type: string
 *           description: 用户简介
 *         roles:
 *           type: array
 *           items:
 *             type: string
 *           description: 角色ID列表
 *
 *     UpdateUserDto:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: 邮箱
 *         phone:
 *           type: string
 *           description: 手机号
 *         nickname:
 *           type: string
 *           description: 昵称
 *         avatar:
 *           type: string
 *           description: 头像URL
 *         bio:
 *           type: string
 *           description: 用户简介
 *         status:
 *           type: string
 *           enum: [ACTIVE, INACTIVE, BANNED]
 *           description: 用户状态
 *         roles:
 *           type: array
 *           items:
 *             type: string
 *           description: 角色ID列表
 *         isActive:
 *           type: boolean
 *           description: 是否激活
 *
 *     UserResponseDto:
 *       type: object
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
 *           description: 邮箱
 *         phone:
 *           type: string
 *           description: 手机号
 *           nullable: true
 *         nickname:
 *           type: string
 *           description: 昵称
 *           nullable: true
 *         avatar:
 *           type: string
 *           description: 头像URL
 *           nullable: true
 *         bio:
 *           type: string
 *           description: 用户简介
 *           nullable: true
 *         status:
 *           type: string
 *           description: 用户状态
 *           enum: [active, inactive, locked, pending]
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
 */ 