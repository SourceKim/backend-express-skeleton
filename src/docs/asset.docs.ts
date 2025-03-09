/**
 * @swagger
 * /assets:
 *   get:
 *     tags:
 *       - 静态资源
 *     summary: 获取资源列表
 *     description: 获取静态资源集合，支持分页和筛选
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
 *         name: type
 *         schema:
 *           type: string
 *         description: 资源类型
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: 资源名称
 *     responses:
 *       200:
 *         description: 成功获取资源列表
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
 *                         $ref: '#/components/schemas/AssetResponseDto'
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
 *       - 静态资源
 *     summary: 上传资源
 *     description: 上传新的静态资源文件
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: 要上传的文件
 *               type:
 *                 type: string
 *                 description: 资源类型
 *                 enum: [image, document, video, audio, other]
 *               name:
 *                 type: string
 *                 description: 资源名称
 *               description:
 *                 type: string
 *                 description: 资源描述
 *     responses:
 *       200:
 *         description: 资源上传成功
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
 *                   $ref: '#/components/schemas/AssetResponseDto'
 *                 error:
 *                   type: object
 *                   nullable: true
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       413:
 *         description: 文件太大
 *       415:
 *         description: 不支持的文件类型
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */

/**
 * @swagger
 * /assets/admin/{id}:
 *   put:
 *     tags:
 *       - 静态资源(管理员)
 *     summary: 更新资源信息
 *     description: 管理员更新指定ID的资源元数据
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 资源ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 description: 资源类型
 *                 enum: [image, document, video, audio, other]
 *               name:
 *                 type: string
 *                 description: 资源名称
 *               description:
 *                 type: string
 *                 description: 资源描述
 *     responses:
 *       200:
 *         description: 资源信息更新成功
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
 *                   $ref: '#/components/schemas/AssetResponseDto'
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
 *       - 静态资源(管理员)
 *     summary: 删除资源
 *     description: 管理员删除指定ID的资源
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 资源ID
 *     responses:
 *       200:
 *         description: 资源删除成功
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
 * /assets/batch:
 *   post:
 *     tags:
 *       - 静态资源
 *     summary: 批量上传资源
 *     description: 一次上传多个静态资源文件
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - files
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: 要上传的文件数组
 *               type:
 *                 type: string
 *                 description: 资源类型
 *                 enum: [image, document, video, audio, other]
 *     responses:
 *       200:
 *         description: 资源批量上传成功
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
 *                     $ref: '#/components/schemas/AssetResponseDto'
 *                 error:
 *                   type: object
 *                   nullable: true
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       413:
 *         description: 文件太大
 *       415:
 *         description: 不支持的文件类型
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */

/**
 * @swagger
 * /assets/batch/delete:
 *   post:
 *     tags:
 *       - 静态资源
 *     summary: 批量删除资源
 *     description: 一次删除多个静态资源
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ids
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: 要删除的资源ID数组
 *     responses:
 *       200:
 *         description: 资源批量删除成功
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
 *                     deleted:
 *                       type: number
 *                       description: 成功删除的数量
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
 * components:
 *   schemas:
 *     AssetResponseDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: 资源ID
 *         type:
 *           type: string
 *           description: 资源类型
 *           enum: [image, document, video, audio, other]
 *         name:
 *           type: string
 *           description: 资源名称
 *         original_name:
 *           type: string
 *           description: 原始文件名
 *         description:
 *           type: string
 *           description: 资源描述
 *           nullable: true
 *         mime_type:
 *           type: string
 *           description: MIME类型
 *         size:
 *           type: number
 *           description: 文件大小(字节)
 *         path:
 *           type: string
 *           description: 存储路径
 *         url:
 *           type: string
 *           description: 访问URL
 *         created_by:
 *           type: string
 *           format: uuid
 *           description: 创建者ID
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: 创建时间
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: 更新时间
 */

/**
 * @swagger
 * /assets/{id}:
 *   get:
 *     tags:
 *       - 静态资源
 *     summary: 获取资源详情
 *     description: 获取指定资源ID的详细信息
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 资源ID
 *     responses:
 *       200:
 *         description: 成功获取资源详情
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
 *                   $ref: '#/components/schemas/AssetResponseDto'
 *                 error:
 *                   type: object
 *                   nullable: true
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */ 