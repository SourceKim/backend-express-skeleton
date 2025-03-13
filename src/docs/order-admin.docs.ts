/**
 * @swagger
 * paths:
 *   /admin/orders:
 *     get:
 *       tags:
 *         - 订单管理
 *       summary: 获取所有订单
 *       description: 管理员获取所有订单，支持分页和筛选
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
 *           name: order_number
 *           schema:
 *             type: string
 *           description: 订单编号
 *         - in: query
 *           name: status
 *           schema:
 *             $ref: '#/components/schemas/OrderStatus'
 *           description: 订单状态
 *         - in: query
 *           name: user_id
 *           schema:
 *             type: integer
 *           description: 用户ID
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
 *         403:
 *           $ref: '#/components/responses/ForbiddenError'
 *
 *   /admin/orders/{id}:
 *     put:
 *       tags:
 *         - 订单管理
 *       summary: 更新订单状态
 *       description: 管理员更新订单状态
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: 订单ID
 *           schema:
 *             type: string
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateOrderStatusDto'
 *       responses:
 *         200:
 *           description: 成功更新订单状态
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
 *         403:
 *           $ref: '#/components/responses/ForbiddenError'
 *         404:
 *           $ref: '#/components/responses/NotFoundError'
 *
 *   /admin/orders/stats:
 *     get:
 *       tags:
 *         - 订单管理
 *       summary: 获取订单统计数据
 *       description: 管理员获取订单统计数据，如总销售额、订单数量等
 *       security:
 *         - BearerAuth: []
 *       parameters:
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
 *           description: 成功获取订单统计数据
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
 *                           total_sales:
 *                             type: number
 *                             description: 总销售额
 *                             example: 99999.99
 *                           total_orders:
 *                             type: integer
 *                             description: 总订单数
 *                             example: 100
 *                           status_counts:
 *                             type: object
 *                             description: 各状态订单数量
 *                             properties:
 *                               pending:
 *                                 type: integer
 *                                 example: 20
 *                               paid:
 *                                 type: integer
 *                                 example: 30
 *                               shipped:
 *                                 type: integer
 *                                 example: 25
 *                               completed:
 *                                 type: integer
 *                                 example: 20
 *                               refunding:
 *                                 type: integer
 *                                 example: 3
 *                               refunded:
 *                                 type: integer
 *                                 example: 2
 *         401:
 *           $ref: '#/components/responses/UnauthorizedError'
 *         403:
 *           $ref: '#/components/responses/ForbiddenError'
 */ 