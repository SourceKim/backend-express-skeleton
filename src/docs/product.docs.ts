/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - description
 *         - price
 *         - stock
 *         - images
 *         - category_id
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: 产品ID
 *         name:
 *           type: string
 *           description: 产品名称
 *         description:
 *           type: string
 *           description: 产品描述
 *         price:
 *           type: number
 *           format: float
 *           description: 产品价格
 *         stock:
 *           type: number
 *           description: 库存数量
 *         images:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Material'
 *           description: 产品素材列表
 *         category_id:
 *           type: string
 *           format: uuid
 *           description: 产品分类ID
 *         category:
 *           $ref: '#/components/schemas/Category'
 *           description: 产品分类对象
 *         status:
 *           type: string
 *           enum: [active, inactive, out_of_stock]
 *           description: 产品状态
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: 创建时间
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: 更新时间
 *
 *     Material:
 *       type: object
 *       required:
 *         - id
 *         - type
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: 素材ID
 *         filename:
 *           type: string
 *           description: 文件名
 *         originalname:
 *           type: string
 *           description: 原始文件名
 *         path:
 *           type: string
 *           description: 文件路径
 *         mimetype:
 *           type: string
 *           description: MIME类型
 *         size:
 *           type: number
 *           description: 文件大小
 *         type:
 *           type: string
 *           enum: [image, audio, video, document, text, other]
 *           description: 素材类型
 *         category:
 *           type: string
 *           description: 素材分类
 *         description:
 *           type: string
 *           description: 素材描述
 *         is_public:
 *           type: boolean
 *           description: 是否公开
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: 创建时间
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: 更新时间
 *
 *     Category:
 *       type: object
 *       required:
 *         - id
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: 分类ID
 *         name:
 *           type: string
 *           description: 分类名称
 *         description:
 *           type: string
 *           description: 分类描述
 *         parent_id:
 *           type: string
 *           format: uuid
 *           description: 父分类ID
 *         children:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Category'
 *           description: 子分类列表
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: 创建时间
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: 更新时间
 *
 *     CreateCategoryDto:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: 分类名称
 *         description:
 *           type: string
 *           description: 分类描述
 *         parent_id:
 *           type: string
 *           format: uuid
 *           description: 父分类ID
 *
 *     UpdateCategoryDto:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: 分类名称
 *         description:
 *           type: string
 *           description: 分类描述
 *         parent_id:
 *           type: string
 *           format: uuid
 *           description: 父分类ID
 *
 *     CreateProductDto:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - price
 *         - stock
 *         - images
 *         - category_id
 *       properties:
 *         name:
 *           type: string
 *           description: 产品名称
 *         description:
 *           type: string
 *           description: 产品描述
 *         price:
 *           type: number
 *           format: float
 *           minimum: 0
 *           description: 产品价格
 *         stock:
 *           type: number
 *           minimum: 0
 *           description: 库存数量
 *         images:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           description: 素材ID列表
 *           minItems: 1
 *         category_id:
 *           type: string
 *           format: uuid
 *           description: 产品分类ID
 *         status:
 *           type: string
 *           enum: [active, inactive]
 *           default: active
 *           description: 产品状态
 *
 *     UpdateProductDto:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: 产品名称
 *         description:
 *           type: string
 *           description: 产品描述
 *         price:
 *           type: number
 *           format: float
 *           minimum: 0
 *           description: 产品价格
 *         stock:
 *           type: number
 *           minimum: 0
 *           description: 库存数量
 *         images:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           description: 素材ID列表
 *           minItems: 1
 *         category_id:
 *           type: string
 *           format: uuid
 *           description: 产品分类ID
 *         status:
 *           type: string
 *           enum: [active, inactive]
 *           description: 产品状态
 */

/**
 * @swagger
 * /products:
 *   get:
 *     tags:
 *       - Products
 *     summary: 获取产品列表
 *     description: 获取所有产品的列表，支持分页和分类筛选
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
 *           maximum: 100
 *           default: 10
 *         description: 每页数量
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: 产品分类
 *     responses:
 *       200:
 *         description: 成功获取产品列表
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 total:
 *                   type: number
 *                   description: 总记录数
 *                 page:
 *                   type: number
 *                   description: 当前页码
 *                 limit:
 *                   type: number
 *                   description: 每页数量
 *                 totalPages:
 *                   type: number
 *                   description: 总页数
 */

/**
 * @swagger
 * /products/admin:
 *   post:
 *     tags:
 *       - Products(admin)
 *     summary: 创建产品
 *     description: 管理员创建新产品
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductDto'
 *     responses:
 *       201:
 *         description: 产品创建成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *                 message:
 *                   type: string
 *                   example: 产品创建成功
 *       400:
 *         description: 请求参数错误
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: 未授权
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 未授权
 *       403:
 *         description: 没有管理员权限
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 没有管理员权限
 */

/**
 * @swagger
 * /products/categories:
 *   get:
 *     tags:
 *       - Products
 *     summary: 获取所有产品分类
 *     description: 获取系统中所有的产品分类
 *     responses:
 *       200:
 *         description: 成功获取产品分类
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
 *                   example: 获取产品分类成功
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 */

/**
 * @swagger
 * /products/admin/categories:
 *   post:
 *     tags:
 *       - Categories(admin)
 *     summary: 创建分类
 *     description: 管理员创建新分类
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCategoryDto'
 *     responses:
 *       201:
 *         description: 分类创建成功
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
 *                   example: 创建分类成功
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       400:
 *         description: 请求参数错误
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: 未授权
 *       403:
 *         description: 没有管理员权限
 */

/**
 * @swagger
 * /products/admin/categories/{id}:
 *   get:
 *     tags:
 *       - Categories(admin)
 *     summary: 获取分类详情
 *     description: 管理员获取分类详情
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: 分类ID
 *     responses:
 *       200:
 *         description: 成功获取分类详情
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
 *                   example: 获取分类详情成功
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       404:
 *         description: 分类不存在
 *       401:
 *         description: 未授权
 *       403:
 *         description: 没有管理员权限
 *
 *   put:
 *     tags:
 *       - Categories(admin)
 *     summary: 更新分类
 *     description: 管理员更新分类信息
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: 分类ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCategoryDto'
 *     responses:
 *       200:
 *         description: 分类更新成功
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
 *                   example: 更新分类成功
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       400:
 *         description: 请求参数错误
 *       404:
 *         description: 分类不存在
 *       401:
 *         description: 未授权
 *       403:
 *         description: 没有管理员权限
 *
 *   delete:
 *     tags:
 *       - Categories(admin)
 *     summary: 删除分类
 *     description: 管理员删除分类
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: 分类ID
 *     responses:
 *       200:
 *         description: 分类删除成功
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
 *                   example: 删除分类成功
 *       400:
 *         description: 无法删除含有子分类或关联产品的分类
 *       404:
 *         description: 分类不存在
 *       401:
 *         description: 未授权
 *       403:
 *         description: 没有管理员权限
 */

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     tags:
 *       - Products
 *     summary: 获取产品详情
 *     description: 根据ID获取产品详情
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 产品ID
 *     responses:
 *       200:
 *         description: 成功获取产品详情
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: 产品不存在
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 产品不存在
 */

/**
 * @swagger
 * /products/admin/{id}:
 *   put:
 *     tags:
 *       - Products(admin)
 *     summary: 更新产品
 *     description: 管理员根据ID更新产品信息
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 产品ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProductDto'
 *     responses:
 *       200:
 *         description: 产品更新成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *                 message:
 *                   type: string
 *                   example: 产品更新成功
 *       400:
 *         description: 请求参数错误
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: 未授权
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 未授权
 *       403:
 *         description: 没有管理员权限
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 没有管理员权限
 *       404:
 *         description: 产品不存在
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 产品不存在
 *
 *   delete:
 *     tags:
 *       - Products(admin)
 *     summary: 删除产品
 *     description: 管理员根据ID删除产品
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 产品ID
 *     responses:
 *       200:
 *         description: 产品删除成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 产品删除成功
 *       401:
 *         description: 未授权
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 未授权
 *       403:
 *         description: 没有管理员权限
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 没有管理员权限
 *       404:
 *         description: 产品不存在
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 产品不存在
 */ 