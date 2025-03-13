/**
 * @swagger
 * components:
 *   schemas:
 *     OrderStatus:
 *       type: string
 *       enum: [pending, paid, shipped, completed, refunding, refunded]
 *       description: 订单状态
 *
 *     OrderItem:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: 订单项ID
 *           example: 550e8400-e29b-41d4-a716-446655440000
 *         product_id:
 *           type: number
 *           description: 商品ID
 *           example: 1
 *         quantity:
 *           type: integer
 *           description: 数量
 *           example: 2
 *         price:
 *           type: number
 *           format: float
 *           description: 单价
 *           example: 4999.99
 *         product:
 *           $ref: '#/components/schemas/Product'
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
 *         - product_id
 *         - quantity
 *         - price
 *
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: 订单ID
 *           example: 550e8400-e29b-41d4-a716-446655440000
 *         order_number:
 *           type: string
 *           description: 订单编号
 *           example: ORD20230501123456
 *         user_id:
 *           type: number
 *           description: 用户ID
 *           example: 1
 *         total_price:
 *           type: number
 *           format: float
 *           description: 总价
 *           example: 9999.98
 *         status:
 *           $ref: '#/components/schemas/OrderStatus'
 *         remark:
 *           type: string
 *           description: 备注
 *           example: 请尽快发货
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         user:
 *           $ref: '#/components/schemas/User'
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
 *         - order_number
 *         - user_id
 *         - total_price
 *         - status
 *
 *     OrderItemDto:
 *       type: object
 *       properties:
 *         product_id:
 *           type: integer
 *           description: 商品ID
 *           example: 1
 *         quantity:
 *           type: integer
 *           description: 数量
 *           minimum: 1
 *           example: 2
 *       required:
 *         - product_id
 *         - quantity
 *
 *     CreateOrderDto:
 *       type: object
 *       properties:
 *         remark:
 *           type: string
 *           description: 备注
 *           example: 请尽快发货
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItemDto'
 *           description: 订单项列表
 *       required:
 *         - items
 *
 *     UpdateOrderStatusDto:
 *       type: object
 *       properties:
 *         status:
 *           $ref: '#/components/schemas/OrderStatus'
 *         remark:
 *           type: string
 *           description: 备注
 *           example: 已发货，请注意查收
 *       required:
 *         - status
 *
 *     OrderQueryDto:
 *       allOf:
 *         - $ref: '#/components/schemas/PaginationQuery'
 *         - type: object
 *           properties:
 *             order_number:
 *               type: string
 *               description: 订单编号
 *               example: ORD20230501
 *             status:
 *               $ref: '#/components/schemas/OrderStatus'
 *             user_id:
 *               type: number
 *               description: 用户ID
 *               example: 1
 *             start_date:
 *               type: string
 *               format: date
 *               description: 开始日期
 *               example: 2023-01-01
 *             end_date:
 *               type: string
 *               format: date
 *               description: 结束日期
 *               example: 2023-12-31
 *             min_price:
 *               type: number
 *               description: 最低价格
 *               example: 1000
 *             max_price:
 *               type: number
 *               description: 最高价格
 *               example: 10000
 *
 * paths:
 *   /user/orders:
 *     post:
 *       tags:
 *         - 订单
 *       summary: 创建订单
 *       description: 用户创建新订单
 *       security:
 *         - BearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateOrderDto'
 *       responses:
 *         201:
 *           description: 成功创建订单
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/Order'
 *         400:
 *           $ref: '#/components/responses/ValidationError'
 *         401:
 *           $ref: '#/components/responses/UnauthorizedError'
 *         404:
 *           description: 商品不存在或库存不足
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiResponse'
 *               example:
 *                 code: 404
 *                 message: 商品不存在或库存不足
 *
 *     get:
 *       tags:
 *         - 订单
 *       summary: 获取用户订单列表
 *       description: 获取当前用户的订单列表，支持分页和筛选
 *       security:
 *         - BearerAuth: []
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
 *           name: status
 *           schema:
 *             $ref: '#/components/schemas/OrderStatus'
 *           description: 订单状态
 *         - in: query
 *           name: start_date
 *           schema:
 *             type: string
 *             format: date
 *           description: 开始日期
 *         - in: query
 *           name: end_date
 *           schema:
 *             type: string
 *             format: date
 *           description: 结束日期
 *       responses:
 *         200:
 *           description: 成功获取订单列表
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
 *                                   $ref: '#/components/schemas/Order'
 *         401:
 *           $ref: '#/components/responses/UnauthorizedError'
 *
 *   /user/orders/{id}:
 *     get:
 *       tags:
 *         - 订单
 *       summary: 获取订单详情
 *       description: 获取当前用户的指定订单详情
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: 订单ID
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: 成功获取订单详情
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/Order'
 *         401:
 *           $ref: '#/components/responses/UnauthorizedError'
 *         403:
 *           description: 无权访问该订单
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiResponse'
 *               example:
 *                 code: 403
 *                 message: 无权访问该订单
 *         404:
 *           $ref: '#/components/responses/NotFoundError'
 *
 *   /user/orders/{id}/cancel:
 *     post:
 *       tags:
 *         - 订单
 *       summary: 取消订单
 *       description: 取消当前用户的指定订单
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: 订单ID
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: 成功取消订单
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/Order'
 *         401:
 *           $ref: '#/components/responses/UnauthorizedError'
 *         403:
 *           description: 无权取消该订单或订单状态不允许取消
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiResponse'
 *               example:
 *                 code: 403
 *                 message: 无权取消该订单或订单状态不允许取消
 *         404:
 *           $ref: '#/components/responses/NotFoundError'
 */ 