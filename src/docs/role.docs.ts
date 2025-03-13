/**
 * @swagger
 * components:
 *   schemas:
 *     Permission:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: 权限ID
 *           example: 550e8400-e29b-41d4-a716-446655440000
 *         name:
 *           type: string
 *           description: 权限名称
 *           example: 创建用户
 *         resource:
 *           type: string
 *           description: 资源名称
 *           example: user
 *         action:
 *           type: string
 *           description: 操作名称
 *           example: create
 *         description:
 *           type: string
 *           description: 权限描述
 *           example: 允许创建新用户
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: 创建时间
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: 更新时间
 *       required:
 *         - id
 *         - name
 *         - resource
 *         - action
 *
 *     Role:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: 角色ID
 *           example: 550e8400-e29b-41d4-a716-446655440000
 *         name:
 *           type: string
 *           description: 角色名称
 *           example: 管理员
 *         description:
 *           type: string
 *           description: 角色描述
 *           example: 系统管理员，拥有所有权限
 *         permissions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Permission'
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: 创建时间
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: 更新时间
 *       required:
 *         - id
 *         - name
 *
 *     CreateRoleDto:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: 角色名称
 *           example: 编辑者
 *         description:
 *           type: string
 *           description: 角色描述
 *           example: 内容编辑人员
 *       required:
 *         - name
 *
 *     UpdateRoleDto:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: 角色名称
 *           example: 高级编辑者
 *         description:
 *           type: string
 *           description: 角色描述
 *           example: 高级内容编辑人员
 *
 *     AssignPermissionsDto:
 *       type: object
 *       properties:
 *         permissions:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           description: 权限ID列表
 *           example: ["550e8400-e29b-41d4-a716-446655440000", "550e8400-e29b-41d4-a716-446655440001"]
 *       required:
 *         - permissions
 *
 *     AssignRolesDto:
 *       type: object
 *       properties:
 *         roles:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           description: 角色ID列表
 *           example: ["550e8400-e29b-41d4-a716-446655440000", "550e8400-e29b-41d4-a716-446655440001"]
 *       required:
 *         - roles
 *
 *     RoleResponseDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: 角色ID
 *           example: 550e8400-e29b-41d4-a716-446655440000
 *         name:
 *           type: string
 *           description: 角色名称
 *           example: 管理员
 *         description:
 *           type: string
 *           description: 角色描述
 *           example: 系统管理员，拥有所有权限
 *         permissions:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *               name:
 *                 type: string
 *               resource:
 *                 type: string
 *               action:
 *                 type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: 创建时间
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: 更新时间
 *       required:
 *         - id
 *         - name
 *         - permissions
 *         - created_at
 *         - updated_at
 *
 *     UserRolesResponseDto:
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
 *           example: admin
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
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     name:
 *                       type: string
 *                     resource:
 *                       type: string
 *                     action:
 *                       type: string
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: 更新时间
 *       required:
 *         - id
 *         - username
 *         - roles
 *         - updated_at
 *
 * paths:
 *   /roles:
 *     get:
 *       tags:
 *         - 角色管理
 *       summary: 获取所有角色
 *       description: 获取系统中所有角色的列表
 *       security:
 *         - BearerAuth: []
 *       responses:
 *         200:
 *           description: 成功获取角色列表
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/Role'
 *         401:
 *           $ref: '#/components/responses/UnauthorizedError'
 *         403:
 *           $ref: '#/components/responses/ForbiddenError'
 *
 *     post:
 *       tags:
 *         - 角色管理
 *       summary: 创建角色
 *       description: 创建新的角色
 *       security:
 *         - BearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateRoleDto'
 *       responses:
 *         201:
 *           description: 成功创建角色
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/Role'
 *         400:
 *           $ref: '#/components/responses/ValidationError'
 *         401:
 *           $ref: '#/components/responses/UnauthorizedError'
 *         403:
 *           $ref: '#/components/responses/ForbiddenError'
 *
 *   /roles/{id}:
 *     get:
 *       tags:
 *         - 角色管理
 *       summary: 获取角色详情
 *       description: 根据ID获取角色详细信息
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: 角色ID
 *           schema:
 *             type: string
 *             format: uuid
 *       responses:
 *         200:
 *           description: 成功获取角色详情
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/Role'
 *         401:
 *           $ref: '#/components/responses/UnauthorizedError'
 *         403:
 *           $ref: '#/components/responses/ForbiddenError'
 *         404:
 *           $ref: '#/components/responses/NotFoundError'
 *
 *     put:
 *       tags:
 *         - 角色管理
 *       summary: 更新角色
 *       description: 更新现有角色信息
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: 角色ID
 *           schema:
 *             type: string
 *             format: uuid
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateRoleDto'
 *       responses:
 *         200:
 *           description: 成功更新角色
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/Role'
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
 *         - 角色管理
 *       summary: 删除角色
 *       description: 删除指定角色
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: 角色ID
 *           schema:
 *             type: string
 *             format: uuid
 *       responses:
 *         200:
 *           description: 成功删除角色
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
 *                             format: uuid
 *                             description: 被删除的角色ID
 *         401:
 *           $ref: '#/components/responses/UnauthorizedError'
 *         403:
 *           $ref: '#/components/responses/ForbiddenError'
 *         404:
 *           $ref: '#/components/responses/NotFoundError'
 *
 *   /roles/{roleId}/permissions:
 *     post:
 *       tags:
 *         - 角色管理
 *       summary: 为角色分配权限
 *       description: 为指定角色分配一组权限
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - name: roleId
 *           in: path
 *           required: true
 *           description: 角色ID
 *           schema:
 *             type: string
 *             format: uuid
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AssignPermissionsDto'
 *       responses:
 *         200:
 *           description: 成功为角色分配权限
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/Role'
 *         400:
 *           $ref: '#/components/responses/ValidationError'
 *         401:
 *           $ref: '#/components/responses/UnauthorizedError'
 *         403:
 *           $ref: '#/components/responses/ForbiddenError'
 *         404:
 *           $ref: '#/components/responses/NotFoundError'
 *
 *   /roles/users/{userId}/roles:
 *     post:
 *       tags:
 *         - 角色管理
 *       summary: 为用户分配角色
 *       description: 为指定用户分配一组角色
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - name: userId
 *           in: path
 *           required: true
 *           description: 用户ID
 *           schema:
 *             type: string
 *             format: uuid
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AssignRolesDto'
 *       responses:
 *         200:
 *           description: 成功为用户分配角色
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/UserRolesResponseDto'
 *         400:
 *           $ref: '#/components/responses/ValidationError'
 *         401:
 *           $ref: '#/components/responses/UnauthorizedError'
 *         403:
 *           $ref: '#/components/responses/ForbiddenError'
 *         404:
 *           $ref: '#/components/responses/NotFoundError'
 */ 