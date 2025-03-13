/**
 * @swagger
 * components:
 *   schemas:
 *     MaterialType:
 *       type: string
 *       enum: [image, audio, video, document, text, other]
 *       description: 素材类型
 *
 *     Material:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: 素材ID
 *           example: 550e8400-e29b-41d4-a716-446655440000
 *         filename:
 *           type: string
 *           description: 素材文件名
 *           example: image.jpg
 *         originalname:
 *           type: string
 *           description: 素材原始文件名
 *           example: my_image.jpg
 *         path:
 *           type: string
 *           description: 素材存储路径
 *           example: /uploads/images/image.jpg
 *         mimetype:
 *           type: string
 *           description: 素材MIME类型
 *           example: image/jpeg
 *         size:
 *           type: integer
 *           description: 素材文件大小（字节）
 *           example: 102400
 *         type:
 *           $ref: '#/components/schemas/MaterialType'
 *         category:
 *           type: string
 *           description: 素材分类
 *           example: 产品图片
 *         description:
 *           type: string
 *           description: 素材描述
 *           example: 这是一张产品宣传图片
 *         is_public:
 *           type: boolean
 *           description: 素材是否公开
 *           example: true
 *         upload_dir:
 *           type: string
 *           description: 素材上传目录
 *           example: /uploads/images
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *             username:
 *               type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: 素材标签
 *           example: ["产品", "宣传"]
 *         metadata:
 *           type: object
 *           description: 素材元数据
 *           example: {"width": 1920, "height": 1080}
 *         parent_id:
 *           type: string
 *           format: uuid
 *           description: 父素材ID
 *           example: 550e8400-e29b-41d4-a716-446655440000
 *         url:
 *           type: string
 *           description: 素材访问URL
 *           example: https://example.com/uploads/images/image.jpg
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
 *         - type
 *         - is_public
 *         - created_at
 *         - updated_at
 *
 *     CreateMaterialDto:
 *       type: object
 *       properties:
 *         category:
 *           type: string
 *           description: 素材分类
 *           example: 产品图片
 *         description:
 *           type: string
 *           description: 素材描述
 *           example: 这是一张产品宣传图片
 *         is_public:
 *           type: boolean
 *           description: 素材是否公开
 *           example: true
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: 素材标签
 *           example: ["产品", "宣传"]
 *         metadata:
 *           type: object
 *           description: 素材元数据
 *           example: {"width": 1920, "height": 1080}
 *         parent_id:
 *           type: string
 *           format: uuid
 *           description: 父素材ID
 *           example: 550e8400-e29b-41d4-a716-446655440000
 *
 *     CreateTextMaterialDto:
 *       type: object
 *       properties:
 *         content:
 *           type: string
 *           description: 文本内容
 *           example: 这是一段文本内容
 *         category:
 *           type: string
 *           description: 素材分类
 *           example: 产品描述
 *         is_public:
 *           type: boolean
 *           description: 素材是否公开
 *           example: true
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: 素材标签
 *           example: ["产品", "描述"]
 *         metadata:
 *           type: object
 *           description: 素材元数据
 *           example: {"format": "markdown"}
 *         parent_id:
 *           type: string
 *           format: uuid
 *           description: 父素材ID
 *           example: 550e8400-e29b-41d4-a716-446655440000
 *       required:
 *         - content
 *
 *     UpdateMaterialDto:
 *       type: object
 *       properties:
 *         filename:
 *           type: string
 *           description: 素材文件名
 *           example: new_image.jpg
 *         originalname:
 *           type: string
 *           description: 素材原始文件名
 *           example: new_my_image.jpg
 *         description:
 *           type: string
 *           description: 素材描述
 *           example: 这是一张更新后的产品宣传图片
 *         category:
 *           type: string
 *           description: 素材分类
 *           example: 更新后的产品图片
 *         is_public:
 *           type: boolean
 *           description: 素材是否公开
 *           example: false
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: 素材标签
 *           example: ["产品", "宣传", "更新"]
 *         metadata:
 *           type: object
 *           description: 素材元数据
 *           example: {"width": 1920, "height": 1080, "updated": true}
 *
 *     GetMaterialsQueryDto:
 *       allOf:
 *         - $ref: '#/components/schemas/PaginationQuery'
 *         - type: object
 *           properties:
 *             type:
 *               oneOf:
 *                 - $ref: '#/components/schemas/MaterialType'
 *                 - type: array
 *                   items:
 *                     $ref: '#/components/schemas/MaterialType'
 *               description: 素材类型
 *             category:
 *               type: string
 *               description: 素材分类
 *               example: 产品图片
 *             keyword:
 *               type: string
 *               description: 搜索关键词
 *               example: 产品
 *             is_public:
 *               type: boolean
 *               description: 是否公开
 *               example: true
 *             tags:
 *               type: array
 *               items:
 *                 type: string
 *               description: 素材标签
 *               example: ["产品", "宣传"]
 *             parent_id:
 *               type: string
 *               format: uuid
 *               description: 父素材ID
 *               example: 550e8400-e29b-41d4-a716-446655440000
 *             min_size:
 *               type: integer
 *               description: 最小文件大小
 *               example: 1024
 *             max_size:
 *               type: integer
 *               description: 最大文件大小
 *
 *     BatchDeleteMaterialsDto:
 *       type: object
 *       properties:
 *         ids:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           description: 素材ID列表
 *           example: ["550e8400-e29b-41d4-a716-446655440000", "550e8400-e29b-41d4-a716-446655440001"]
 *       required:
 *         - ids
 *
 * paths:
 *   /materials:
 *     get:
 *       tags:
 *         - 素材管理
 *       summary: 获取素材列表
 *       description: 获取素材列表，支持分页、搜索和筛选
 *       parameters:
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
 *         - in: query
 *           name: type
 *           schema:
 *             oneOf:
 *               - $ref: '#/components/schemas/MaterialType'
 *               - type: array
 *                 items:
 *                   $ref: '#/components/schemas/MaterialType'
 *           description: 素材类型
 *         - in: query
 *           name: category
 *           schema:
 *             type: string
 *           description: 素材分类
 *         - in: query
 *           name: keyword
 *           schema:
 *             type: string
 *           description: 搜索关键词
 *         - in: query
 *           name: is_public
 *           schema:
 *             type: boolean
 *           description: 是否公开
 *         - in: query
 *           name: tags
 *           schema:
 *             type: array
 *             items:
 *               type: string
 *           description: 素材标签
 *         - in: query
 *           name: parent_id
 *           schema:
 *             type: string
 *             format: uuid
 *           description: 父素材ID
 *         - in: query
 *           name: min_size
 *           schema:
 *             type: integer
 *           description: 最小文件大小
 *         - in: query
 *           name: max_size
 *           schema:
 *             type: integer
 *           description: 最大文件大小
 *       responses:
 *         200:
 *           description: 成功获取素材列表
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
 *                                   $ref: '#/components/schemas/Material'
 *
 *   /materials/{id}:
 *     get:
 *       tags:
 *         - 素材管理
 *       summary: 获取素材详情
 *       description: 根据ID获取素材详细信息
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: 素材ID
 *           schema:
 *             type: string
 *             format: uuid
 *       responses:
 *         200:
 *           description: 成功获取素材详情
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/Material'
 *         404:
 *           $ref: '#/components/responses/NotFoundError'
 *
 *   /materials/{id}/related:
 *     get:
 *       tags:
 *         - 素材管理
 *       summary: 获取相关素材
 *       description: 获取与指定素材相关的素材列表
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: 素材ID
 *           schema:
 *             type: string
 *             format: uuid
 *       responses:
 *         200:
 *           description: 成功获取相关素材
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
 *                           $ref: '#/components/schemas/Material'
 *         404:
 *           $ref: '#/components/responses/NotFoundError'
 *
 *   /materials/{id}/versions:
 *     get:
 *       tags:
 *         - 素材管理
 *       summary: 获取素材版本
 *       description: 获取指定素材的所有版本
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: 素材ID
 *           schema:
 *             type: string
 *             format: uuid
 *       responses:
 *         200:
 *           description: 成功获取素材版本
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
 *                           $ref: '#/components/schemas/Material'
 *         404:
 *           $ref: '#/components/responses/NotFoundError'
 *
 *   /materials/upload:
 *     post:
 *       tags:
 *         - 素材管理
 *       summary: 上传素材
 *       description: 上传新素材文件
 *       security:
 *         - BearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 file:
 *                   type: string
 *                   format: binary
 *                   description: 素材文件
 *                 category:
 *                   type: string
 *                   description: 素材分类
 *                 description:
 *                   type: string
 *                   description: 素材描述
 *                 is_public:
 *                   type: boolean
 *                   description: 是否公开
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: 素材标签
 *                 metadata:
 *                   type: object
 *                   description: 素材元数据
 *                 parent_id:
 *                   type: string
 *                   format: uuid
 *                   description: 父素材ID
 *               required:
 *                 - file
 *       responses:
 *         201:
 *           description: 成功上传素材
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/Material'
 *         400:
 *           $ref: '#/components/responses/ValidationError'
 *         401:
 *           $ref: '#/components/responses/UnauthorizedError'
 *
 *   /materials/upload/batch:
 *     post:
 *       tags:
 *         - 素材管理
 *       summary: 批量上传素材
 *       description: 批量上传多个素材文件
 *       security:
 *         - BearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 files:
 *                   type: array
 *                   items:
 *                     type: string
 *                     format: binary
 *                   description: 素材文件列表
 *                 category:
 *                   type: string
 *                   description: 素材分类
 *                 description:
 *                   type: string
 *                   description: 素材描述
 *                 is_public:
 *                   type: boolean
 *                   description: 是否公开
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: 素材标签
 *                 metadata:
 *                   type: object
 *                   description: 素材元数据
 *                 parent_id:
 *                   type: string
 *                   format: uuid
 *                   description: 父素材ID
 *               required:
 *                 - files
 *       responses:
 *         201:
 *           description: 成功批量上传素材
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
 *                           $ref: '#/components/schemas/Material'
 *         400:
 *           $ref: '#/components/responses/ValidationError'
 *         401:
 *           $ref: '#/components/responses/UnauthorizedError'
 *
 *   /materials/text:
 *     post:
 *       tags:
 *         - 素材管理
 *       summary: 创建文本素材
 *       description: 创建新的文本类型素材
 *       security:
 *         - BearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateTextMaterialDto'
 *       responses:
 *         201:
 *           description: 成功创建文本素材
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/Material'
 *         400:
 *           $ref: '#/components/responses/ValidationError'
 *         401:
 *           $ref: '#/components/responses/UnauthorizedError'
 *
 *   /materials/admin/{id}:
 *     put:
 *       tags:
 *         - 素材管理
 *       summary: 更新素材
 *       description: 更新现有素材信息
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: 素材ID
 *           schema:
 *             type: string
 *             format: uuid
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateMaterialDto'
 *       responses:
 *         200:
 *           description: 成功更新素材
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/Material'
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
 *         - 素材管理
 *       summary: 删除素材
 *       description: 删除指定素材
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: 素材ID
 *           schema:
 *             type: string
 *             format: uuid
 *       responses:
 *         200:
 *           description: 成功删除素材
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
 *                             description: 被删除的素材ID
 *         401:
 *           $ref: '#/components/responses/UnauthorizedError'
 *         403:
 *           $ref: '#/components/responses/ForbiddenError'
 *         404:
 *           $ref: '#/components/responses/NotFoundError'
 *
 *   /materials/admin/batch/delete:
 *     post:
 *       tags:
 *         - 素材管理
 *       summary: 批量删除素材
 *       description: 批量删除多个素材
 *       security:
 *         - BearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BatchDeleteMaterialsDto'
 *       responses:
 *         200:
 *           description: 成功批量删除素材
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
 *                           deleted_count:
 *                             type: integer
 *                             description: 成功删除的素材数量
 *                           ids:
 *                             type: array
 *                             items:
 *                               type: string
 *                               format: uuid
 *                             description: 成功删除的素材ID列表
 *         400:
 *           $ref: '#/components/responses/ValidationError'
 *         401:
 *           $ref: '#/components/responses/UnauthorizedError'
 *         403:
 *           $ref: '#/components/responses/ForbiddenError'
 */ 