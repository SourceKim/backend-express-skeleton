/**
 * @swagger
 * /worship/materials:
 *   get:
 *     tags:
 *       - 上香
 *     summary: 获取上香素材列表
 *     description: 获取上香素材集合，支持按类型筛选
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: 素材类型筛选（incense_burner, incense, buddha, wish）
 *     responses:
 *       200:
 *         description: 成功获取上香素材列表
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
 *                   example: 获取上香素材成功
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: 1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p
 *                       title:
 *                         type: string
 *                         example: 观世音菩萨
 *                       description:
 *                         type: string
 *                         example: 观世音菩萨代表着大慈大悲，救苦救难
 *                       type:
 *                         type: string
 *                         example: buddha
 *                       assetId:
 *                         type: string
 *                         example: 1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p
 *                       asset:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: 1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p
 *                           url:
 *                             type: string
 *                             example: https://storage.askbudda.com/worship/buddha/guanyin.jpg
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2023-01-01T12:00:00Z
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2023-01-02T12:00:00Z
 *       400:
 *         description: 请求参数错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: 未授权
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: 服务器内部错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   post:
 *     tags:
 *       - 上香
 *     summary: 创建上香素材
 *     description: 创建新的上香素材
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - type
 *             properties:
 *               title:
 *                 type: string
 *                 example: 地藏王菩萨
 *               description:
 *                 type: string
 *                 example: 地藏王菩萨以"地狱不空，誓不成佛"的大愿闻名
 *               type:
 *                 type: string
 *                 enum: [buddha, incense_burner, incense, wish]
 *                 example: buddha
 *               assetId:
 *                 type: string
 *                 example: 1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p
 *     responses:
 *       201:
 *         description: 成功创建上香素材
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
 *                   example: 创建上香素材成功
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p
 *                     title:
 *                       type: string
 *                       example: 地藏王菩萨
 *                     description:
 *                       type: string
 *                       example: 地藏王菩萨以"地狱不空，誓不成佛"的大愿闻名
 *                     type:
 *                       type: string
 *                       example: buddha
 *                     assetId:
 *                       type: string
 *                       example: 1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-01-01T12:00:00Z
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-01-02T12:00:00Z
 *       400:
 *         description: 请求参数错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: 未授权
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: 服务器内部错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * 
 * /worship/materials/{id}:
 *   get:
 *     tags:
 *       - 上香
 *     summary: 获取单个上香素材
 *     description: 根据ID获取特定上香素材的详细信息
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: 素材ID
 *     responses:
 *       200:
 *         description: 成功获取上香素材
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
 *                   example: 获取上香素材成功
 *                 data:
 *                   $ref: '#/components/schemas/WorshipMaterialResponse'
 *       400:
 *         description: 请求参数错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: 未授权
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: 资源不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: 服务器内部错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   put:
 *     tags:
 *       - 上香
 *     summary: 更新上香素材
 *     description: 更新指定ID的上香素材信息
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: 素材ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateWorshipMaterialDto'
 *     responses:
 *       200:
 *         description: 更新成功
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
 *                   example: 更新上香素材成功
 *                 data:
 *                   $ref: '#/components/schemas/WorshipMaterialResponse'
 *       400:
 *         description: 请求参数错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: 未授权
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: 资源不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: 服务器内部错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     tags:
 *       - 上香
 *     summary: 删除上香素材
 *     description: 删除指定ID的上香素材
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: 素材ID
 *     responses:
 *       200:
 *         description: 删除成功
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
 *                   example: 删除上香素材成功
 *                 data:
 *                   type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: 请求参数错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: 未授权
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: 资源不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: 服务器内部错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * 
 * /worship/record:
 *   post:
 *     tags:
 *       - 上香
 *     summary: 创建上香记录
 *     description: 记录用户上香行为
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateWorshipRecordDto'
 *     responses:
 *       201:
 *         description: 上香成功
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
 *                   example: 上香成功
 *                 data:
 *                   $ref: '#/components/schemas/WorshipRecordResponse'
 *       400:
 *         description: 请求参数错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: 未授权
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: 服务器内部错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * 
 * /worship/records:
 *   get:
 *     tags:
 *       - 上香
 *     summary: 获取上香记录列表
 *     description: 获取当前用户的所有上香记录，支持分页
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: 页码
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 20
 *         description: 每页数量
 *     responses:
 *       200:
 *         description: 成功获取上香记录
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
 *                   example: 获取上香记录成功
 *                 data:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/WorshipRecordResponse'
 *                     total:
 *                       type: number
 *                       example: 50
 *       400:
 *         description: 请求参数错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: 未授权
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: 服务器内部错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * 
 * /worship/record/{id}:
 *   get:
 *     tags:
 *       - 上香
 *     summary: 获取单个上香记录
 *     description: 根据ID获取特定上香记录的详细信息
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: 记录ID
 *     responses:
 *       200:
 *         description: 成功获取上香记录
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
 *                   example: 获取上香记录成功
 *                 data:
 *                   $ref: '#/components/schemas/WorshipRecordResponse'
 *       400:
 *         description: 请求参数错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: 未授权
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: 资源不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: 服务器内部错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   put:
 *     tags:
 *       - 上香
 *     summary: 更新上香记录
 *     description: 更新指定ID的上香记录信息
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: 记录ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateWorshipRecordDto'
 *     responses:
 *       200:
 *         description: 更新成功
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
 *                   example: 更新上香记录成功
 *                 data:
 *                   $ref: '#/components/schemas/WorshipRecordResponse'
 *       400:
 *         description: 请求参数错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: 未授权
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: 资源不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: 服务器内部错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     tags:
 *       - 上香
 *     summary: 删除上香记录
 *     description: 删除指定ID的上香记录
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: 记录ID
 *     responses:
 *       200:
 *         description: 删除成功
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
 *                   example: 删除上香记录成功
 *                 data:
 *                   type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: 请求参数错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: 未授权
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: 资源不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: 服务器内部错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * 
 * /worship/ranking:
 *   get:
 *     tags:
 *       - 上香
 *     summary: 获取上香排行榜
 *     description: 获取佛像上香次数排行榜
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *         description: 返回记录数量
 *     responses:
 *       200:
 *         description: 成功获取排行榜
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
 *                   example: 获取上香排行榜成功
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/WorshipRankingResponse'
 *       400:
 *         description: 请求参数错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: 未授权
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: 服务器内部错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * 
 * components:
 *   schemas:
 *     CreateWorshipMaterialDto:
 *       type: object
 *       required:
 *         - title
 *         - type
 *       properties:
 *         title:
 *           type: string
 *           description: 素材标题
 *           example: 观音菩萨
 *         description:
 *           type: string
 *           description: 素材描述
 *           example: 观世音菩萨，慈悲智慧
 *         type:
 *           type: string
 *           enum: [incense_burner, incense, buddha, wish]
 *           description: 素材类型
 *           example: buddha
 *         assetId:
 *           type: string
 *           format: uuid
 *           description: 资源ID
 *           example: 123e4567-e89b-12d3-a456-426614174000
 *     
 *     UpdateWorshipMaterialDto:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: 素材标题
 *           example: 观音菩萨
 *         description:
 *           type: string
 *           description: 素材描述
 *           example: 观世音菩萨，慈悲智慧
 *         type:
 *           type: string
 *           enum: [incense_burner, incense, buddha, wish]
 *           description: 素材类型
 *           example: buddha
 *         assetId:
 *           type: string
 *           format: uuid
 *           description: 资源ID
 *           example: 123e4567-e89b-12d3-a456-426614174000
 *     
 *     CreateWorshipRecordDto:
 *       type: object
 *       required:
 *         - buddhaId
 *         - materials
 *       properties:
 *         buddhaId:
 *           type: string
 *           format: uuid
 *           description: 佛像ID
 *           example: 123e4567-e89b-12d3-a456-426614174000
 *         materials:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           description: 上香素材ID列表
 *           example: ['123e4567-e89b-12d3-a456-426614174001', '123e4567-e89b-12d3-a456-426614174002']
 *         wish:
 *           type: string
 *           description: 许愿内容
 *           example: 祈愿世界和平，家人健康
 *     
 *     UpdateWorshipRecordDto:
 *       type: object
 *       properties:
 *         buddhaId:
 *           type: string
 *           format: uuid
 *           description: 佛像ID
 *           example: 123e4567-e89b-12d3-a456-426614174000
 *         materials:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           description: 上香素材ID列表
 *           example: ['123e4567-e89b-12d3-a456-426614174001', '123e4567-e89b-12d3-a456-426614174002']
 *         wish:
 *           type: string
 *           description: 许愿内容
 *           example: 祈愿世界和平，家人健康
 *     
 *     GetWorshipRecordsQueryDto:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *           description: 页码
 *           example: 1
 *         limit:
 *           type: integer
 *           minimum: 1
 *           default: 20
 *           description: 每页数量
 *           example: 20
 *     
 *     GetWorshipRankingQueryDto:
 *       type: object
 *       properties:
 *         limit:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *           description: 返回记录数量
 *           example: 10
 *     
 *     WorshipMaterialResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: 素材ID
 *           example: 123e4567-e89b-12d3-a456-426614174000
 *         title:
 *           type: string
 *           description: 素材标题
 *           example: 观音菩萨
 *         description:
 *           type: string
 *           description: 素材描述
 *           example: 观世音菩萨，慈悲智慧
 *         type:
 *           type: string
 *           enum: [incense_burner, incense, buddha, wish]
 *           description: 素材类型
 *           example: buddha
 *         assetId:
 *           type: string
 *           format: uuid
 *           description: 资源ID
 *           example: 123e4567-e89b-12d3-a456-426614174000
 *         asset:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *               description: 资源ID
 *               example: 123e4567-e89b-12d3-a456-426614174000
 *             url:
 *               type: string
 *               format: uri
 *               description: 素材URL
 *               example: https://example.com/buddha.jpg
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: 创建时间
 *           example: 2023-01-01T00:00:00Z
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: 更新时间
 *           example: 2023-01-01T00:00:00Z
 *     
 *     WorshipRecordResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: 记录ID
 *           example: 123e4567-e89b-12d3-a456-426614174000
 *         buddhaId:
 *           type: string
 *           format: uuid
 *           description: 佛像ID
 *           example: 123e4567-e89b-12d3-a456-426614174001
 *         buddha:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *               description: 佛像ID
 *               example: 123e4567-e89b-12d3-a456-426614174001
 *             title:
 *               type: string
 *               description: 佛像名称
 *               example: 观音菩萨
 *             url:
 *               type: string
 *               format: uri
 *               description: 佛像图片URL
 *               example: https://example.com/buddha.jpg
 *         materials:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *                 description: 素材ID
 *                 example: 123e4567-e89b-12d3-a456-426614174002
 *               title:
 *                 type: string
 *                 description: 素材名称
 *                 example: 香炉
 *               type:
 *                 type: string
 *                 description: 素材类型
 *                 example: incense_burner
 *               url:
 *                 type: string
 *                 format: uri
 *                 description: 素材URL
 *                 example: https://example.com/incense.jpg
 *         wish:
 *           type: string
 *           description: 许愿内容
 *           example: 祈愿世界和平，家人健康
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: 创建时间
 *           example: 2023-01-01T00:00:00Z
 *     
 *     WorshipRankingResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: 佛像ID
 *           example: 123e4567-e89b-12d3-a456-426614174000
 *         title:
 *           type: string
 *           description: 佛像名称
 *           example: 观音菩萨
 *         description:
 *           type: string
 *           description: 佛像描述
 *           example: 观世音菩萨，慈悲智慧
 *         url:
 *           type: string
 *           format: uri
 *           description: 佛像图片URL
 *           example: https://example.com/buddha.jpg
 *         worshipCount:
 *           type: integer
 *           description: 上香次数
 *           example: 1000
 *     
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         code:
 *           type: number
 *           description: 错误码
 *           example: 400
 *         message:
 *           type: string
 *           description: 错误信息
 *           example: 请求参数错误
 *         error:
 *           type: object
 *           description: 详细错误信息
 */ 