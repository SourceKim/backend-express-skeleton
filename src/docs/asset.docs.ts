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
 *           default: 20
 *         description: 每页数量
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [image, audio, video, document, other]
 *         description: 资源类型
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: 资源分类
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: 搜索关键词
 *       - in: query
 *         name: is_public
 *         schema:
 *           type: boolean
 *         description: 是否只获取公开资源
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: string
 *         description: 上传者ID
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
 *                   allOf:
 *                     - $ref: '#/components/schemas/PaginatedResponse'
 *                     - type: object
 *                       properties:
 *                         items:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/AssetDto'
 *                 error:
 *                   type: object
 *                   nullable: true
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */

/**
 * @swagger
 * /assets/{id}:
 *   get:
 *     tags:
 *       - 静态资源
 *     summary: 获取资源详情
 *     description: 获取指定资源的详细信息
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
 *                   $ref: '#/components/schemas/AssetDto'
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
 *       - 静态资源
 *     summary: 更新资源信息
 *     description: 修改指定资源的信息
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
 *             $ref: '#/components/schemas/UpdateAssetDto'
 *     responses:
 *       200:
 *         description: 资源更新成功
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
 *                   $ref: '#/components/schemas/AssetDto'
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
 *       - 静态资源
 *     summary: 删除资源
 *     description: 删除指定的资源记录和文件
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
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */

/**
 * @swagger
 * /assets/upload:
 *   post:
 *     tags:
 *       - 静态资源
 *     summary: 上传资源
 *     description: 上传文件并创建资源记录
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
 *               category:
 *                 type: string
 *                 description: 资源分类
 *               description:
 *                 type: string
 *                 description: 资源描述
 *               is_public:
 *                 type: boolean
 *                 default: false
 *                 description: 是否公开
 *     responses:
 *       201:
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
 *                   $ref: '#/components/schemas/AssetDto'
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
 *     AssetDto:
 *       type: object
 *       required:
 *         - id
 *         - filename
 *         - originalname
 *         - path
 *         - mimetype
 *         - size
 *         - type
 *         - is_public
 *         - url
 *         - upload_dir
 *         - user_id
 *         - created_at
 *         - updated_at
 *       properties:
 *         id:
 *           type: string
 *           description: 资源唯一标识符
 *         filename:
 *           type: string
 *           description: 存储在服务器上的文件名
 *         originalname:
 *           type: string
 *           description: 原始文件名
 *         path:
 *           type: string
 *           description: 文件存储路径
 *         mimetype:
 *           type: string
 *           description: 文件MIME类型
 *         size:
 *           type: number
 *           description: 文件大小（字节）
 *         type:
 *           type: string
 *           enum: [image, audio, video, document, other]
 *           description: 资源类型
 *         category:
 *           type: string
 *           nullable: true
 *           description: 资源分类
 *         description:
 *           type: string
 *           nullable: true
 *           description: 资源描述
 *         is_public:
 *           type: boolean
 *           description: 是否公开
 *         url:
 *           type: string
 *           description: 资源访问URL
 *         upload_dir:
 *           type: string
 *           nullable: true
 *           description: 文件上传目录
 *         user_id:
 *           type: string
 *           nullable: true
 *           description: 上传者ID
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: 创建时间
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: 更新时间
 *       example:
 *         id: "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6"
 *         filename: "1676465463578_1234.jpg"
 *         originalname: "example.jpg"
 *         path: "/uploads/images/1676465463578_1234.jpg"
 *         mimetype: "image/jpeg"
 *         size: 12345
 *         type: "image"
 *         category: "avatar"
 *         description: "用户头像"
 *         is_public: true
 *         url: "http://example.com/uploads/images/1676465463578_1234.jpg"
 *         upload_dir: "/uploads/images"
 *         user_id: "user12345"
 *         created_at: "2023-01-01T00:00:00Z"
 *         updated_at: "2023-01-01T00:00:00Z"
 *     
 *     CreateAssetDto:
 *       type: object
 *       required:
 *         - filename
 *         - originalname
 *         - path
 *         - mimetype
 *         - size
 *         - type
 *       properties:
 *         filename:
 *           type: string
 *           description: 存储在服务器上的文件名
 *         originalname:
 *           type: string
 *           description: 原始文件名
 *         path:
 *           type: string
 *           description: 文件存储路径
 *         mimetype:
 *           type: string
 *           description: 文件MIME类型
 *         size:
 *           type: number
 *           description: 文件大小（字节）
 *         type:
 *           type: string
 *           enum: [image, audio, video, document, other]
 *           description: 资源类型
 *         category:
 *           type: string
 *           description: 资源分类
 *         description:
 *           type: string
 *           description: 资源描述
 *         is_public:
 *           type: boolean
 *           default: false
 *           description: 是否公开
 *         upload_dir:
 *           type: string
 *           description: 文件上传目录
 *         user_id:
 *           type: string
 *           description: 上传者ID
 *     
 *     UpdateAssetDto:
 *       type: object
 *       properties:
 *         filename:
 *           type: string
 *           description: 存储在服务器上的文件名
 *         originalname:
 *           type: string
 *           description: 原始文件名
 *         path:
 *           type: string
 *           description: 文件存储路径
 *         mimetype:
 *           type: string
 *           description: 文件MIME类型
 *         size:
 *           type: number
 *           description: 文件大小（字节）
 *         type:
 *           type: string
 *           enum: [image, audio, video, document, other]
 *           description: 资源类型
 *         category:
 *           type: string
 *           description: 资源分类
 *         description:
 *           type: string
 *           description: 资源描述
 *         is_public:
 *           type: boolean
 *           description: 是否公开
 *         upload_dir:
 *           type: string
 *           description: 文件上传目录
 *         user_id:
 *           type: string
 *           description: 上传者ID
 *     
 *     GetAssetsQueryDto:
 *       allOf:
 *         - $ref: '#/components/schemas/PaginationQueryDto'
 *         - type: object
 *           properties:
 *             type:
 *               type: string
 *               enum: [image, audio, video, document, other]
 *               description: 资源类型
 *             category:
 *               type: string
 *               description: 资源分类
 *             keyword:
 *               type: string
 *               description: 搜索关键词
 *             is_public:
 *               type: boolean
 *               description: 是否只获取公开资源
 *             user_id:
 *               type: string
 *               description: 上传者ID
 */ 