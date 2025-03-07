/**
 * @swagger
 * /meditation/materials:
 *   get:
 *     tags:
 *       - 冥想
 *     summary: 获取冥想素材列表
 *     description: 获取冥想素材集合，支持分页和筛选
 *     security:
 *       - BearerAuth: []
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
 *           enum: [audio, image, text, video]
 *         description: 素材类型
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: 搜索关键词
 *     responses:
 *       200:
 *         description: 成功获取冥想素材列表
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
 *                             $ref: '#/components/schemas/MeditationMaterialDto'
 *                 error:
 *                   type: object
 *                   nullable: true
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 * 
 *   post:
 *     tags:
 *       - 冥想
 *     summary: 创建冥想素材
 *     description: 添加新的冥想素材
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMaterialDto'
 *     responses:
 *       201:
 *         description: 冥想素材创建成功
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
 *                   example: 冥想素材创建成功
 *                 data:
 *                   $ref: '#/components/schemas/MeditationMaterialDto'
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
 * /meditation/materials/{id}:
 *   get:
 *     tags:
 *       - 冥想
 *     summary: 获取冥想素材详情
 *     description: 获取指定冥想素材的详细信息
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 冥想素材ID
 *     responses:
 *       200:
 *         description: 成功获取冥想素材详情
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
 *                   $ref: '#/components/schemas/MeditationMaterialDto'
 *                 error:
 *                   type: object
 *                   nullable: true
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 * 
 *   put:
 *     tags:
 *       - 冥想
 *     summary: 更新冥想素材
 *     description: 修改指定冥想素材的信息
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 冥想素材ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMaterialDto'
 *     responses:
 *       200:
 *         description: 冥想素材更新成功
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
 *                   example: 冥想素材更新成功
 *                 data:
 *                   $ref: '#/components/schemas/MeditationMaterialDto'
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
 * 
 *   delete:
 *     tags:
 *       - 冥想
 *     summary: 删除冥想素材
 *     description: 删除指定的冥想素材
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 冥想素材ID
 *     responses:
 *       200:
 *         description: 冥想素材删除成功
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
 *                   example: 冥想素材删除成功
 *                 data:
 *                   type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                       example: true
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
 * /meditation/start:
 *   post:
 *     tags:
 *       - 冥想
 *     summary: 开始冥想
 *     description: 创建一个新的冥想记录，标记为开始状态
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - materialId
 *               - duration
 *             properties:
 *               materialId:
 *                 type: string
 *                 description: 冥想素材ID
 *               duration:
 *                 type: integer
 *                 description: 计划冥想时长（单位：秒）
 *     responses:
 *       200:
 *         description: 成功开始冥想
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
 *                   $ref: '#/components/schemas/MeditationRecordDto'
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
 * /meditation/end:
 *   post:
 *     tags:
 *       - 冥想
 *     summary: 结束冥想
 *     description: 结束一个正在进行中的冥想记录
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - meditationId
 *               - actualDuration
 *             properties:
 *               meditationId:
 *                 type: string
 *                 description: 冥想记录ID
 *               actualDuration:
 *                 type: integer
 *                 description: 实际冥想时长（单位：秒）
 *               notes:
 *                 type: string
 *                 description: 冥想笔记
 *     responses:
 *       200:
 *         description: 成功结束冥想
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
 *                   $ref: '#/components/schemas/MeditationRecordDto'
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
 * /meditation/records:
 *   get:
 *     tags:
 *       - 冥想
 *     summary: 获取冥想记录列表
 *     description: 获取当前用户的冥想记录，支持分页和筛选
 *     security:
 *       - BearerAuth: []
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
 *         name: status
 *         schema:
 *           type: string
 *           enum: [start, completed, cancelled]
 *         description: 冥想状态
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: 开始日期
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: 结束日期
 *     responses:
 *       200:
 *         description: 成功获取冥想记录列表
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
 *                             $ref: '#/components/schemas/MeditationRecordDto'
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
 * /meditation/ongoing:
 *   get:
 *     tags:
 *       - 冥想
 *     summary: 获取进行中的冥想
 *     description: 获取当前用户正在进行中的冥想记录
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 成功获取进行中的冥想
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
 *                   oneOf:
 *                     - $ref: '#/components/schemas/MeditationRecordDto'
 *                     - type: 'null'
 *                   description: 若当前无进行中的冥想，则返回null
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
 *   schemas:
 *     CreateMaterialDto:
 *       type: object
 *       required:
 *         - title
 *         - type
 *       properties:
 *         title:
 *           type: string
 *           description: 素材标题
 *         description:
 *           type: string
 *           description: 素材描述
 *         type:
 *           type: string
 *           enum: [audio, image, text, video]
 *           description: 素材类型
 *         assetId:
 *           type: string
 *           format: uuid
 *           description: 资源ID（audio, image, video类型必填）
 *         content:
 *           type: string
 *           description: 素材内容（text类型必填）
 *         duration:
 *           type: integer
 *           description: 素材时长（单位：秒，适用于音频视频）
 *
 *     UpdateMaterialDto:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: 素材标题
 *         description:
 *           type: string
 *           description: 素材描述
 *         type:
 *           type: string
 *           enum: [audio, image, text, video]
 *           description: 素材类型
 *         assetId:
 *           type: string
 *           format: uuid
 *           description: 资源ID
 *         content:
 *           type: string
 *           description: 素材内容
 *         duration:
 *           type: integer
 *           description: 素材时长（单位：秒）
 *
 *     MeditationMaterialDto:
 *       type: object
 *       required:
 *         - id
 *         - title
 *         - type
 *         - created_at
 *         - updated_at
 *       properties:
 *         id:
 *           type: string
 *           description: 素材ID
 *         title:
 *           type: string
 *           description: 素材标题
 *         description:
 *           type: string
 *           nullable: true
 *           description: 素材描述
 *         type:
 *           type: string
 *           enum: [audio, image, text, video]
 *           description: 素材类型
 *         assetId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           description: 资源ID
 *         asset:
 *           type: object
 *           nullable: true
 *           properties:
 *             id:
 *               type: string
 *               description: 资源ID
 *             path:
 *               type: string
 *               description: 资源路径
 *             mimetype:
 *               type: string
 *               description: 资源MIME类型
 *           description: 关联的资源信息
 *         content:
 *           type: string
 *           nullable: true
 *           description: 素材内容
 *         duration:
 *           type: integer
 *           nullable: true
 *           description: 素材时长（单位：秒）
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: 创建时间
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: 更新时间
 *
 *     MeditationRecordDto:
 *       type: object
 *       required:
 *         - id
 *         - userId
 *         - status
 *         - startTime
 *         - materials
 *         - created_at
 *         - updated_at
 *       properties:
 *         id:
 *           type: string
 *           description: 记录ID
 *         userId:
 *           type: string
 *           description: 用户ID
 *         status:
 *           type: string
 *           enum: [start, completed, cancelled]
 *           description: 冥想状态
 *         startTime:
 *           type: string
 *           format: date-time
 *           description: 开始时间
 *         endTime:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: 结束时间
 *         duration:
 *           type: integer
 *           nullable: true
 *           description: 冥想时长（单位：秒）
 *         materials:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: 素材ID
 *               title:
 *                 type: string
 *                 description: 素材标题
 *               type:
 *                 type: string
 *                 enum: [audio, image, text, video]
 *                 description: 素材类型
 *               assetId:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *                 description: 资源ID
 *               asset:
 *                 type: object
 *                 nullable: true
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: 资源ID
 *                   path:
 *                     type: string
 *                     description: 资源路径
 *                   mimetype:
 *                     type: string
 *                     description: 资源MIME类型
 *                 description: 关联的资源信息
 *               content:
 *                 type: string
 *                 nullable: true
 *                 description: 素材内容
 *           description: 冥想使用的素材列表
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: 创建时间
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: 更新时间
 */ 