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
 *         - image
 *         - category
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
 *         image:
 *           type: string
 *           description: 产品图片URL
 *         category:
 *           type: string
 *           description: 产品分类
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
 *     CreateProductDto:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - price
 *         - stock
 *         - image
 *         - category
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
 *         image:
 *           type: string
 *           description: 产品图片URL
 *         category:
 *           type: string
 *           description: 产品分类
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
 *         image:
 *           type: string
 *           description: 产品图片URL
 *         category:
 *           type: string
 *           description: 产品分类
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
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
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