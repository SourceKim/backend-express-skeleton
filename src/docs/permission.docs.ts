/**
 * @swagger
 * /permissions:
 *   get:
 *     tags:
 *       - 权限管理(管理员)
 *     summary: 获取权限列表
 *     description: 管理员获取系统中所有权限的列表
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 成功获取权限列表
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
 *                     $ref: '#/components/schemas/PermissionResponseDto'
 *                 error:
 *                   type: object
 *                   nullable: true
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: 没有管理员权限
 *       500:
 *         $ref: '#/components/responses/InternalError'
 *   
 *   post:
 *     tags:
 *       - 权限管理(管理员)
 *     summary: 创建权限
 *     description: 管理员创建新的权限定义
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePermissionDto'
 *     responses:
 *       200:
 *         description: 权限创建成功
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
 *                   $ref: '#/components/schemas/PermissionResponseDto'
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
 */

/**
 * @swagger
 * /permissions/{id}:
 *   get:
 *     tags:
 *       - 权限管理(管理员)
 *     summary: 获取权限详情
 *     description: 管理员获取指定权限ID的详细信息
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 权限ID
 *     responses:
 *       200:
 *         description: 成功获取权限详情
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
 *                   $ref: '#/components/schemas/PermissionResponseDto'
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
 *   put:
 *     tags:
 *       - 权限管理(管理员)
 *     summary: 更新权限
 *     description: 管理员更新指定ID的权限信息
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 权限ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePermissionDto'
 *     responses:
 *       200:
 *         description: 权限更新成功
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
 *                   $ref: '#/components/schemas/PermissionResponseDto'
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
 *       - 权限管理(管理员)
 *     summary: 删除权限
 *     description: 管理员删除指定ID的权限
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 权限ID
 *     responses:
 *       200:
 *         description: 权限删除成功
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
 *     CreatePermissionDto:
 *       type: object
 *       required:
 *         - name
 *         - resource
 *         - action
 *       properties:
 *         name:
 *           type: string
 *           description: 权限名称
 *           minLength: 1
 *           example: 读取用户
 *         resource:
 *           type: string
 *           description: 资源类型
 *           example: user
 *         action:
 *           type: string
 *           description: 操作类型
 *           example: read
 *         description:
 *           type: string
 *           description: 权限描述
 *           nullable: true
 *           example: 允许读取用户信息
 * 
 *     UpdatePermissionDto:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: 权限名称
 *           minLength: 1
 *           example: 读取用户
 *         resource:
 *           type: string
 *           description: 资源类型
 *           example: user
 *         action:
 *           type: string
 *           description: 操作类型
 *           example: read
 *         description:
 *           type: string
 *           description: 权限描述
 *           nullable: true
 *           example: 允许读取用户信息
 * 
 *     PermissionResponseDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: 权限ID
 *         name:
 *           type: string
 *           description: 权限名称
 *         resource:
 *           type: string
 *           description: 资源类型
 *         action:
 *           type: string
 *           description: 操作类型
 *         description:
 *           type: string
 *           description: 权限描述
 *           nullable: true
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: 创建时间
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: 更新时间
 */ 