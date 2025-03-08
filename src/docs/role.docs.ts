/**
 * @swagger
 * /roles:
 *   get:
 *     tags:
 *       - 角色管理
 *     summary: 获取角色列表
 *     description: 获取系统中所有角色的列表
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 成功获取角色列表
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
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/RoleResponseDto'
 *                 error:
 *                   type: object
 *                   nullable: true
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: 权限不足
 *       500:
 *         $ref: '#/components/responses/InternalError'
 *   
 *   post:
 *     tags:
 *       - 角色管理
 *     summary: 创建角色
 *     description: 创建新的角色
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRoleDto'
 *     responses:
 *       200:
 *         description: 角色创建成功
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
 *                   $ref: '#/components/schemas/RoleResponseDto'
 *                 error:
 *                   type: object
 *                   nullable: true
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: 权限不足
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */

/**
 * @swagger
 * /roles/{id}:
 *   get:
 *     tags:
 *       - 角色管理
 *     summary: 获取角色详情
 *     description: 获取指定角色ID的详细信息
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 角色ID
 *     responses:
 *       200:
 *         description: 成功获取角色详情
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
 *                   $ref: '#/components/schemas/RoleResponseDto'
 *                 error:
 *                   type: object
 *                   nullable: true
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: 权限不足
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 *   
 *   put:
 *     tags:
 *       - 角色管理
 *     summary: 更新角色
 *     description: 更新指定ID的角色信息
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 角色ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateRoleDto'
 *     responses:
 *       200:
 *         description: 角色更新成功
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
 *                   $ref: '#/components/schemas/RoleResponseDto'
 *                 error:
 *                   type: object
 *                   nullable: true
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: 权限不足
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 *   
 *   delete:
 *     tags:
 *       - 角色管理
 *     summary: 删除角色
 *     description: 删除指定ID的角色
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 角色ID
 *     responses:
 *       200:
 *         description: 角色删除成功
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
 *         description: 权限不足
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */

/**
 * @swagger
 * /roles/{roleId}/permissions:
 *   post:
 *     tags:
 *       - 角色管理
 *     summary: 为角色分配权限
 *     description: 为指定角色ID分配一组权限
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *         description: 角色ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssignPermissionsDto'
 *     responses:
 *       200:
 *         description: 权限分配成功
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
 *                   $ref: '#/components/schemas/RoleResponseDto'
 *                 error:
 *                   type: object
 *                   nullable: true
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: 权限不足
 *       404:
 *         description: 角色不存在
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */

/**
 * @swagger
 * /roles/users/{userId}/roles:
 *   post:
 *     tags:
 *       - 角色管理
 *     summary: 为用户分配角色
 *     description: 为指定用户ID分配一组角色
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
 *             $ref: '#/components/schemas/AssignRolesDto'
 *     responses:
 *       200:
 *         description: 角色分配成功
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
 *                   $ref: '#/components/schemas/UserRolesResponseDto'
 *                 error:
 *                   type: object
 *                   nullable: true
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: 权限不足
 *       404:
 *         description: 用户不存在
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateRoleDto:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: 角色名称
 *           minLength: 1
 *           example: 管理员
 *         description:
 *           type: string
 *           description: 角色描述
 *           nullable: true
 *           example: 系统管理员，拥有所有权限
 * 
 *     UpdateRoleDto:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: 角色名称
 *           minLength: 1
 *           example: 管理员
 *         description:
 *           type: string
 *           description: 角色描述
 *           nullable: true
 *           example: 系统管理员，拥有所有权限
 * 
 *     AssignPermissionsDto:
 *       type: object
 *       required:
 *         - permissions
 *       properties:
 *         permissions:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           description: 权限ID列表
 *           example: ["550e8400-e29b-41d4-a716-446655440000", "550e8400-e29b-41d4-a716-446655440001"]
 * 
 *     AssignRolesDto:
 *       type: object
 *       required:
 *         - roles
 *       properties:
 *         roles:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           description: 角色ID列表
 *           example: ["550e8400-e29b-41d4-a716-446655440000", "550e8400-e29b-41d4-a716-446655440001"]
 * 
 *     RoleResponseDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: 角色ID
 *         name:
 *           type: string
 *           description: 角色名称
 *         description:
 *           type: string
 *           description: 角色描述
 *           nullable: true
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
 *           description: 角色包含的权限列表
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: 创建时间
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: 更新时间
 * 
 *     UserRolesResponseDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: 用户ID
 *         username:
 *           type: string
 *           description: 用户名
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
 *           description: 用户拥有的角色列表
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: 更新时间
 */ 