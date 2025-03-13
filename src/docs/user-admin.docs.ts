/**
 * @swagger
 * components:
 *   schemas:
 *     CreateUserDto:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: 用户名
 *           example: johndoe
 *           minLength: 3
 *           maxLength: 100
 *         password:
 *           type: string
 *           description: 密码
 *           example: password123
 *           minLength: 6
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
 *         roles:
 *           type: array
 *           items:
 *             type: string
 *           description: 角色ID列表
 *           example: ["550e8400-e29b-41d4-a716-446655440000"]
 *       required:
 *         - username
 *         - password
 *
 *     AdminUpdateUserDto:
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
 *         status:
 *           $ref: '#/components/schemas/UserStatus'
 *         roles:
 *           type: array
 *           items:
 *             type: string
 *           description: 角色ID列表
 *           example: ["550e8400-e29b-41d4-a716-446655440000"]
 *
 *     UserQueryDto:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: 用户名（模糊查询）
 *           example: john
 *         email:
 *           type: string
 *           description: 邮箱（模糊查询）
 *           example: john@example.com
 *         status:
 *           $ref: '#/components/schemas/UserStatus'
 *       allOf:
 *         - $ref: '#/components/schemas/PaginationQuery'
 *
 * paths:
 *   /users/admin:
 *     get:
 *       tags:
 *         - 用户管理
 *       summary: 获取用户列表
 *       description: 管理员获取所有用户的列表，支持分页和筛选
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - in: query
 *           name: username
 *           schema:
 *             type: string
 *           description: 用户名（模糊查询）
 *         - in: query
 *           name: email
 *           schema:
 *             type: string
 *           description: 邮箱（模糊查询）
 *         - in: query
 *           name: status
 *           schema:
 *             $ref: '#/components/schemas/UserStatus'
 *         - in: query
 *           name: page
 *           schema:
 *             type: integer
 *             default: 1
 *           description: 页码
 *         - in: query
 *           name: limit
 *           schema:
 *             type: integer
 *             default: 20
 *           description: 每页数量
 *         - in: query
 *           name: sort_by
 *           schema:
 *             type: string
 *             default: created_at
 *           description: 排序字段
 *         - in: query
 *           name: sort_order
 *           schema:
 *             type: string
 *             enum: [ASC, DESC]
 *             default: DESC
 *           description: 排序方向
 *       responses:
 *         200:
 *           description: 成功获取用户列表
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         allOf:
 *                           - $ref: '#/components/schemas/PaginatedResponse'
 *                           - type: object
 *                             properties:
 *                               items:
 *                                 type: array
 *                                 items:
 *                                   $ref: '#/components/schemas/User'
 *         401:
 *           $ref: '#/components/responses/UnauthorizedError'
 *         403:
 *           $ref: '#/components/responses/ForbiddenError'
 *
 *     post:
 *       tags:
 *         - 用户管理
 *       summary: 创建用户
 *       description: 管理员创建新用户
 *       security:
 *         - BearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateUserDto'
 *       responses:
 *         201:
 *           description: 成功创建用户
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
 *         403:
 *           $ref: '#/components/responses/ForbiddenError'
 *
 *   /users/admin/{id}:
 *     get:
 *       tags:
 *         - 用户管理
 *       summary: 获取指定用户
 *       description: 管理员获取指定用户的详细信息
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: 用户ID
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
 *         403:
 *           $ref: '#/components/responses/ForbiddenError'
 *         404:
 *           $ref: '#/components/responses/NotFoundError'
 *
 *     put:
 *       tags:
 *         - 用户管理
 *       summary: 更新指定用户
 *       description: 管理员更新指定用户的信息
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: 用户ID
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminUpdateUserDto'
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
 *         403:
 *           $ref: '#/components/responses/ForbiddenError'
 *         404:
 *           $ref: '#/components/responses/NotFoundError'
 *
 *     delete:
 *       tags:
 *         - 用户管理
 *       summary: 删除用户
 *       description: 管理员删除指定用户
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: 用户ID
 *       responses:
 *         200:
 *           description: 成功删除用户
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             description: 被删除的用户ID
 *         401:
 *           $ref: '#/components/responses/UnauthorizedError'
 *         403:
 *           $ref: '#/components/responses/ForbiddenError'
 *         404:
 *           $ref: '#/components/responses/NotFoundError'
 */ 