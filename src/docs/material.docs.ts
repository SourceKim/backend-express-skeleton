/**
 * @swagger
 * components:
 *   schemas:
 *     Material:
 *       type: object
 *       required:
 *         - id
 *         - type
 *         - is_public
 *         - created_at
 *         - updated_at
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: 素材唯一标识符
 *         filename:
 *           type: string
 *           description: 素材文件名
 *         originalname:
 *           type: string
 *           description: 素材原始文件名
 *         path:
 *           type: string
 *           description: 素材存储路径
 *         mimetype:
 *           type: string
 *           description: 素材MIME类型
 *         size:
 *           type: number
 *           description: 素材文件大小（字节）
 *         type:
 *           type: string
 *           enum: [image, audio, video, document, text, other]
 *           description: 素材类型
 *         category:
 *           type: string
 *           description: 素材分类
 *         description:
 *           type: string
 *           description: 素材描述或文本内容
 *         is_public:
 *           type: boolean
 *           description: 素材是否公开
 *         upload_dir:
 *           type: string
 *           description: 素材上传目录
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *             username:
 *               type: string
 *           description: 素材所属用户
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: 素材标签
 *         metadata:
 *           type: object
 *           description: 素材元数据
 *         parent_id:
 *           type: string
 *           format: uuid
 *           description: 父素材ID
 *         url:
 *           type: string
 *           description: 素材访问URL
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: 创建时间
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: 更新时间
 *
 *     CreateMaterialDto:
 *       type: object
 *       properties:
 *         category:
 *           type: string
 *           description: 素材分类
 *         description:
 *           type: string
 *           description: 素材描述
 *         is_public:
 *           type: boolean
 *           description: 素材是否公开
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: 素材标签
 *         metadata:
 *           type: object
 *           description: 素材元数据
 *         parent_id:
 *           type: string
 *           format: uuid
 *           description: 父素材ID
 *
 *     CreateTextMaterialDto:
 *       type: object
 *       required:
 *         - content
 *       properties:
 *         content:
 *           type: string
 *           description: 文本内容
 *         category:
 *           type: string
 *           description: 素材分类
 *         is_public:
 *           type: boolean
 *           description: 素材是否公开
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: 素材标签
 *         metadata:
 *           type: object
 *           description: 素材元数据
 *         parent_id:
 *           type: string
 *           format: uuid
 *           description: 父素材ID
 *
 *     UpdateMaterialDto:
 *       type: object
 *       properties:
 *         filename:
 *           type: string
 *           description: 素材文件名
 *         originalname:
 *           type: string
 *           description: 素材原始文件名
 *         description:
 *           type: string
 *           description: 素材描述
 *         category:
 *           type: string
 *           description: 素材分类
 *         is_public:
 *           type: boolean
 *           description: 素材是否公开
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: 素材标签
 *         metadata:
 *           type: object
 *           description: 素材元数据
 *
 *     GetMaterialsQueryDto:
 *       allOf:
 *         - $ref: '#/components/schemas/PaginationQueryDto'
 *         - type: object
 *           properties:
 *             type:
 *               type: string
 *               enum: [image, audio, video, document, text, other]
 *               description: 素材类型
 *             category:
 *               type: string
 *               description: 素材分类
 *             keyword:
 *               type: string
 *               description: 搜索关键词
 *             is_public:
 *               type: boolean
 *               description: 是否公开
 *             tags:
 *               type: array
 *               items:
 *                 type: string
 *               description: 素材标签
 *             parent_id:
 *               type: string
 *               format: uuid
 *               description: 父素材ID
 *             min_size:
 *               type: number
 *               description: 最小文件大小
 *             max_size:
 *               type: number
 *               description: 最大文件大小
 *
 *     PaginatedMaterialsResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/PaginatedResponse'
 *         - type: object
 *           properties:
 *             items:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Material'
 *
 *     BatchDeleteMaterialsDto:
 *       type: object
 *       required:
 *         - ids
 *       properties:
 *         ids:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           description: 要删除的素材ID列表
 */

/**
 * @swagger
 * tags:
 *   name: Materials
 *   description: 素材管理API
 */

/**
 * @swagger
 * /materials:
 *   get:
 *     summary: 获取素材列表
 *     description: 分页获取素材列表，支持多种过滤条件
 *     tags: [Materials]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           default: 1
 *         description: 页码
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 20
 *         description: 每页数量
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           default: created_at
 *         description: 排序字段
 *       - in: query
 *         name: sort_order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: DESC
 *         description: 排序方向
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [image, audio, video, document, text, other]
 *         description: 素材类型
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: 素材分类
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: 搜索关键词
 *       - in: query
 *         name: is_public
 *         schema:
 *           type: boolean
 *         description: 是否公开
 *       - in: query
 *         name: tags
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: 素材标签
 *       - in: query
 *         name: parent_id
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 父素材ID
 *       - in: query
 *         name: min_size
 *         schema:
 *           type: number
 *         description: 最小文件大小
 *       - in: query
 *         name: max_size
 *         schema:
 *           type: number
 *         description: 最大文件大小
 *     responses:
 *       200:
 *         description: 成功获取素材列表
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedMaterialsResponse'
 *       400:
 *         description: 请求参数错误
 *       500:
 *         description: 服务器内部错误
 *
 *   post:
 *     summary: 上传素材
 *     description: 上传文件类型素材
 *     tags: [Materials]
 *     security:
 *       - bearerAuth: []
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
 *                 description: 素材分类
 *               description:
 *                 type: string
 *                 description: 素材描述
 *               is_public:
 *                 type: boolean
 *                 description: 素材是否公开
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: 素材标签
 *               metadata:
 *                 type: object
 *                 description: 素材元数据
 *               parent_id:
 *                 type: string
 *                 format: uuid
 *                 description: 父素材ID
 *     responses:
 *       201:
 *         description: 素材上传成功
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Material'
 *       400:
 *         description: 请求参数错误
 *       401:
 *         description: 未授权
 *       500:
 *         description: 服务器内部错误
 */

/**
 * @swagger
 * /materials/{id}:
 *   get:
 *     summary: 获取素材详情
 *     description: 根据ID获取素材详情
 *     tags: [Materials]
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
 *         description: 成功获取素材详情
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Material'
 *       404:
 *         description: 素材不存在
 *       500:
 *         description: 服务器内部错误
 */

/**
 * @swagger
 * /materials/{id}/related:
 *   get:
 *     summary: 获取相关素材
 *     description: 获取与指定素材相关的素材列表
 *     tags: [Materials]
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
 *         description: 成功获取相关素材
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Material'
 *       404:
 *         description: 素材不存在
 *       500:
 *         description: 服务器内部错误
 */

/**
 * @swagger
 * /materials/{id}/versions:
 *   get:
 *     summary: 获取素材版本
 *     description: 获取指定素材的所有版本
 *     tags: [Materials]
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
 *         description: 成功获取素材版本
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Material'
 *       404:
 *         description: 素材不存在
 *       500:
 *         description: 服务器内部错误
 */

/**
 * @swagger
 * /materials/upload/batch:
 *   post:
 *     summary: 批量上传素材
 *     description: 批量上传多个文件类型素材
 *     tags: [Materials]
 *     security:
 *       - bearerAuth: []
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
 *                 description: 要上传的文件列表
 *               category:
 *                 type: string
 *                 description: 素材分类
 *               is_public:
 *                 type: boolean
 *                 description: 素材是否公开
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: 素材标签
 *               metadata:
 *                 type: object
 *                 description: 素材元数据
 *     responses:
 *       201:
 *         description: 素材批量上传成功
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Material'
 *       400:
 *         description: 请求参数错误
 *       401:
 *         description: 未授权
 *       500:
 *         description: 服务器内部错误
 */

/**
 * @swagger
 * /materials/text:
 *   post:
 *     summary: 创建文本素材
 *     description: 创建纯文本类型素材
 *     tags: [Materials]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTextMaterialDto'
 *     responses:
 *       201:
 *         description: 文本素材创建成功
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Material'
 *       400:
 *         description: 请求参数错误
 *       401:
 *         description: 未授权
 *       500:
 *         description: 服务器内部错误
 */

/**
 * @swagger
 * /materials/admin/{id}:
 *   put:
 *     summary: 更新素材
 *     description: 更新素材信息（需要管理员权限）
 *     tags: [Materials]
 *     security:
 *       - bearerAuth: []
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
 *             $ref: '#/components/schemas/UpdateMaterialDto'
 *     responses:
 *       200:
 *         description: 素材更新成功
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Material'
 *       400:
 *         description: 请求参数错误
 *       401:
 *         description: 未授权
 *       403:
 *         description: 权限不足
 *       404:
 *         description: 素材不存在
 *       500:
 *         description: 服务器内部错误
 *
 *   delete:
 *     summary: 删除素材
 *     description: 删除指定素材（需要管理员权限）
 *     tags: [Materials]
 *     security:
 *       - bearerAuth: []
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
 *         description: 素材删除成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: 未授权
 *       403:
 *         description: 权限不足
 *       404:
 *         description: 素材不存在
 *       500:
 *         description: 服务器内部错误
 */

/**
 * @swagger
 * /materials/admin/batch/delete:
 *   post:
 *     summary: 批量删除素材
 *     description: 批量删除多个素材（需要管理员权限）
 *     tags: [Materials]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BatchDeleteMaterialsDto'
 *     responses:
 *       200:
 *         description: 素材批量删除成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: 请求参数错误
 *       401:
 *         description: 未授权
 *       403:
 *         description: 权限不足
 *       500:
 *         description: 服务器内部错误
 */ 