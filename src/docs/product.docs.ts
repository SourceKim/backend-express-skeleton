/**
 * @swagger
 * components:
 *   schemas:
 *     ProductStatus:
 *       type: string
 *       enum: [active, inactive]
 *       description: 商品状态
 *
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: 分类ID
 *           example: 550e8400-e29b-41d4-a716-446655440000
 *         name:
 *           type: string
 *           description: 分类名称
 *           example: 电子产品
 *         description:
 *           type: string
 *           description: 分类描述
 *           example: 各类电子产品
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
 *         - name
 *
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: 商品ID
 *           example: 550e8400-e29b-41d4-a716-446655440000
 *         name:
 *           type: string
 *           description: 商品名称
 *           example: 智能手机
 *         description:
 *           type: string
 *           description: 商品描述
 *           example: 最新款智能手机，配置高端
 *         price:
 *           type: number
 *           format: float
 *           description: 价格
 *           example: 4999.99
 *         stock:
 *           type: integer
 *           description: 库存
 *           example: 100
 *         status:
 *           $ref: '#/components/schemas/ProductStatus'
 *         category_id:
 *           type: string
 *           format: uuid
 *           description: 分类ID
 *           example: 550e8400-e29b-41d4-a716-446655440000
 *         category:
 *           $ref: '#/components/schemas/Category'
 *         materials:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *               name:
 *                 type: string
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
 *         - name
 *         - price
 *         - stock
 *         - status
 *
 *     CreateCategoryDto:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: 分类名称
 *           example: 电子产品
 *         description:
 *           type: string
 *           description: 分类描述
 *           example: 各类电子产品
 *       required:
 *         - name
 *
 *     UpdateCategoryDto:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: 分类名称
 *           example: 电子产品
 *         description:
 *           type: string
 *           description: 分类描述
 *           example: 各类电子产品
 *
 *     CreateProductDto:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: 商品名称
 *           example: 智能手机
 *         description:
 *           type: string
 *           description: 商品描述
 *           example: 最新款智能手机，配置高端
 *         price:
 *           type: number
 *           format: float
 *           description: 价格
 *           minimum: 0
 *           example: 4999.99
 *         stock:
 *           type: integer
 *           description: 库存
 *           minimum: 1
 *           example: 100
 *         status:
 *           $ref: '#/components/schemas/ProductStatus'
 *         category_id:
 *           type: string
 *           format: uuid
 *           description: 分类ID
 *           example: 550e8400-e29b-41d4-a716-446655440000
 *         material_ids:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           description: 材料ID列表
 *       required:
 *         - name
 *         - price
 *         - stock
 *
 *     UpdateProductDto:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: 商品名称
 *           example: 智能手机
 *         description:
 *           type: string
 *           description: 商品描述
 *           example: 最新款智能手机，配置高端
 *         price:
 *           type: number
 *           format: float
 *           description: 价格
 *           minimum: 0
 *           example: 4999.99
 *         stock:
 *           type: integer
 *           description: 库存
 *           minimum: 1
 *           example: 100
 *         status:
 *           $ref: '#/components/schemas/ProductStatus'
 *         category_id:
 *           type: string
 *           format: uuid
 *           description: 分类ID
 *           example: 550e8400-e29b-41d4-a716-446655440000
 *         material_ids:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           description: 材料ID列表
 *
 *     ProductQueryDto:
 *       allOf:
 *         - $ref: '#/components/schemas/PaginationQuery'
 *         - type: object
 *           properties:
 *             keyword:
 *               type: string
 *               description: 搜索关键词
 *               example: 手机
 *             category_id:
 *               type: string
 *               format: uuid
 *               description: 分类ID
 *             status:
 *               $ref: '#/components/schemas/ProductStatus'
 *             min_price:
 *               type: number
 *               description: 最低价格
 *               example: 1000
 *             max_price:
 *               type: number
 *               description: 最高价格
 *
 * paths:
 *   /user/products:
 *     get:
 *       tags:
 *         - 商品
 *       summary: 获取商品列表
 *       description: 获取商品列表，支持分页、搜索和筛选
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
 *           name: keyword
 *           schema:
 *             type: string
 *           description: 搜索关键词
 *         - in: query
 *           name: category_id
 *           schema:
 *             type: string
 *           description: 分类ID
 *         - in: query
 *           name: min_price
 *           schema:
 *             type: number
 *           description: 最低价格
 *         - in: query
 *           name: max_price
 *           schema:
 *             type: number
 *           description: 最高价格
 *       responses:
 *         200:
 *           description: 成功获取商品列表
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
 *                                   $ref: '#/components/schemas/Product'
 *
 *   /user/products/{id}:
 *     get:
 *       tags:
 *         - 商品
 *       summary: 获取商品详情
 *       description: 根据ID获取商品详细信息
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: 商品ID
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: 成功获取商品详情
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/Product'
 *         404:
 *           $ref: '#/components/responses/NotFoundError'
 *
 *   /user/categories:
 *     get:
 *       tags:
 *         - 商品
 *       summary: 获取所有商品分类
 *       description: 获取所有可用的商品分类
 *       responses:
 *         200:
 *           description: 成功获取商品分类
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
 *                           $ref: '#/components/schemas/Category'
 */ 