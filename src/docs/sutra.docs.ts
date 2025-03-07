/**
 * @swagger
 * /sutras:
 *   get:
 *     tags:
 *       - 经文
 *     summary: 获取经文列表
 *     description: 获取经文集合，支持分页和筛选
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
 *         name: category
 *         schema:
 *           type: string
 *         description: 经文类别
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: 搜索关键词
 *     responses:
 *       200:
 *         description: 成功获取经文列表
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
 *                             $ref: '#/components/schemas/SutraDto'
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
 *       - 经文
 *     summary: 创建经文
 *     description: 添加新的经文记录
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSutraDto'
 *     responses:
 *       201:
 *         description: 经文创建成功
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
 *                   $ref: '#/components/schemas/SutraDto'
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
 * /sutras/{id}:
 *   get:
 *     tags:
 *       - 经文
 *     summary: 获取经文详情
 *     description: 获取指定经文的详细信息
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 经文ID
 *     responses:
 *       200:
 *         description: 成功获取经文详情
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
 *                   $ref: '#/components/schemas/SutraDto'
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
 *       - 经文
 *     summary: 更新经文
 *     description: 修改指定经文的信息
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 经文ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateSutraDto'
 *     responses:
 *       200:
 *         description: 经文更新成功
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
 *                   $ref: '#/components/schemas/SutraDto'
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
 *       - 经文
 *     summary: 删除经文
 *     description: 删除指定的经文记录
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 经文ID
 *     responses:
 *       200:
 *         description: 经文删除成功
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
 *                     id:
 *                       type: string
 *                 error:
 *                   type: object
 *                   nullable: true
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
 *     CreateSutraDto:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - content
 *         - category
 *       properties:
 *         title:
 *           type: string
 *           description: 经文标题
 *         description:
 *           type: string
 *           description: 经文描述
 *         content:
 *           type: string
 *           description: 经文内容
 *         category:
 *           type: string
 *           description: 经文分类
 *
 *     UpdateSutraDto:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: 经文标题
 *           nullable: true
 *         description:
 *           type: string
 *           description: 经文描述
 *           nullable: true
 *         content:
 *           type: string
 *           description: 经文内容
 *           nullable: true
 *         category:
 *           type: string
 *           description: 经文分类
 *           nullable: true
 *
 *     GetSutrasQueryDto:
 *       allOf:
 *         - $ref: '#/components/schemas/PaginationQueryDto'
 *         - type: object
 *           properties:
 *             category:
 *               type: string
 *               description: 经文分类
 *               nullable: true
 *             keyword:
 *               type: string
 *               description: 搜索关键词
 *               nullable: true
 *
 *     SutraDto:
 *       type: object
 *       required:
 *         - id
 *         - title
 *         - description
 *         - content
 *         - category
 *         - read_count
 *         - created_at
 *         - updated_at
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: 经文ID
 *         title:
 *           type: string
 *           description: 经文标题
 *         description:
 *           type: string
 *           description: 经文描述
 *         content:
 *           type: string
 *           description: 经文内容
 *         category:
 *           type: string
 *           description: 经文分类
 *         read_count:
 *           type: number
 *           description: 阅读次数
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: 创建时间
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: 更新时间
 *
 *     PaginatedSutrasResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/PaginatedResponse'
 *         - type: object
 *           properties:
 *             items:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SutraDto'
 */ 