/**
 * @swagger
 * components:
 *   schemas:
 *     OrderProduct:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - price
 *         - quantity
 *         - image
 *       properties:
 *         id:
 *           type: string
 *           description: 产品ID
 *         name:
 *           type: string
 *           description: 产品名称
 *         price:
 *           type: number
 *           format: float
 *           description: 产品价格
 *         quantity:
 *           type: number
 *           minimum: 1
 *           description: 数量
 *         image:
 *           type: string
 *           description: 产品图片URL
 *
 *     OrderAddress:
 *       type: object
 *       required:
 *         - name
 *         - phone
 *         - address
 *       properties:
 *         name:
 *           type: string
 *           description: 收货人姓名
 *         phone:
 *           type: string
 *           description: 联系电话
 *         address:
 *           type: string
 *           description: 详细地址
 *
 *     Order:
 *       type: object
 *       required:
 *         - id
 *         - orderNo
 *         - userId
 *         - products
 *         - totalAmount
 *         - status
 *         - address
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: 订单ID
 *         orderNo:
 *           type: string
 *           description: 订单编号
 *         userId:
 *           type: string
 *           format: uuid
 *           description: 用户ID
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderProduct'
 *           description: 订单商品列表
 *         totalAmount:
 *           type: number
 *           format: float
 *           description: 订单总金额
 *         status:
 *           type: string
 *           enum: [pending, paid, shipped, completed, cancelled]
 *           description: 订单状态
 *         address:
 *           $ref: '#/components/schemas/OrderAddress'
 *           description: 收货地址
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: 创建时间
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: 更新时间
 *
 *     CreateOrderDto:
 *       type: object
 *       required:
 *         - address
 *       properties:
 *         address:
 *           $ref: '#/components/schemas/OrderAddress'
 *           description: 收货地址
 *
 *     UpdateOrderStatusDto:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [pending, paid, shipped, completed, cancelled]
 *           description: 订单状态
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     tags:
 *       - 订单管理
 *     summary: 获取订单列表
 *     description: 获取当前用户的订单列表
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 成功获取订单列表
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
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
 *
 *   post:
 *     tags:
 *       - 订单管理
 *     summary: 创建订单
 *     description: 从购物车创建订单
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderDto'
 *     responses:
 *       201:
 *         description: 订单创建成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *                 message:
 *                   type: string
 *                   example: 订单创建成功
 *       400:
 *         description: 请求参数错误或购物车为空
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
 */

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     tags:
 *       - 订单管理
 *     summary: 获取订单详情
 *     description: 根据ID获取订单详情
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 订单ID
 *     responses:
 *       200:
 *         description: 成功获取订单详情
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Order'
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
 *       404:
 *         description: 订单不存在
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 订单不存在
 */

/**
 * @swagger
 * /orders/{id}/status:
 *   put:
 *     tags:
 *       - 订单管理
 *     summary: 更新订单状态
 *     description: 更新指定订单的状态
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 订单ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateOrderStatusDto'
 *     responses:
 *       200:
 *         description: 订单状态已更新
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *                 message:
 *                   type: string
 *                   example: 订单状态已更新
 *       400:
 *         description: 请求参数错误或非法的状态转换
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
 *       404:
 *         description: 订单不存在
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 订单不存在
 */

/**
 * @swagger
 * /orders/admin:
 *   get:
 *     tags:
 *       - 订单管理(管理员)
 *     summary: 获取所有订单
 *     description: 管理员获取所有用户的订单列表
 *     security:
 *       - BearerAuth: []
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
 *     responses:
 *       200:
 *         description: 成功获取订单列表
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       401:
 *         description: 未授权
 *       403:
 *         description: 没有管理员权限
 */

/**
 * @swagger
 * /orders/admin/filter:
 *   get:
 *     tags:
 *       - 订单管理(管理员)
 *     summary: 筛选订单
 *     description: 管理员按条件筛选订单
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: orderNo
 *         schema:
 *           type: string
 *         description: 订单编号
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: 用户ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, paid, shipped, completed, cancelled]
 *         description: 订单状态
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: 开始日期
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: 结束日期
 *       - in: query
 *         name: minAmount
 *         schema:
 *           type: number
 *         description: 最小金额
 *       - in: query
 *         name: maxAmount
 *         schema:
 *           type: number
 *         description: 最大金额
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
 *     responses:
 *       200:
 *         description: 成功获取筛选后的订单列表
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       401:
 *         description: 未授权
 *       403:
 *         description: 没有管理员权限
 */

/**
 * @swagger
 * /orders/admin/{id}:
 *   put:
 *     tags:
 *       - 订单管理(管理员)
 *     summary: 更新订单信息
 *     description: 管理员更新订单信息
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 订单ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, paid, shipped, completed, cancelled]
 *               address:
 *                 $ref: '#/components/schemas/OrderAddress'
 *     responses:
 *       200:
 *         description: 订单信息已更新
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *                 message:
 *                   type: string
 *                   example: 订单信息已更新
 *       400:
 *         description: 请求参数错误或非法的状态转换
 *       401:
 *         description: 未授权
 *       403:
 *         description: 没有管理员权限
 *       404:
 *         description: 订单不存在
 */

/**
 * @swagger
 * /orders/admin/{id}:
 *   delete:
 *     tags:
 *       - 订单管理(管理员)
 *     summary: 删除订单
 *     description: 管理员删除订单
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 订单ID
 *     responses:
 *       200:
 *         description: 订单已删除
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 订单已删除
 *       401:
 *         description: 未授权
 *       403:
 *         description: 没有管理员权限
 *       404:
 *         description: 订单不存在
 */

/**
 * @swagger
 * /orders/admin/statistics:
 *   get:
 *     tags:
 *       - 订单管理(管理员)
 *     summary: 获取订单统计数据
 *     description: 管理员获取订单统计数据
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 成功获取订单统计数据
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalOrders:
 *                       type: integer
 *                       description: 总订单数
 *                     statusCounts:
 *                       type: object
 *                       properties:
 *                         pending:
 *                           type: integer
 *                         paid:
 *                           type: integer
 *                         shipped:
 *                           type: integer
 *                         completed:
 *                           type: integer
 *                         cancelled:
 *                           type: integer
 *                     todayOrders:
 *                       type: integer
 *                       description: 今日订单数
 *                     totalSales:
 *                       type: number
 *                       description: 总销售额
 *       401:
 *         description: 未授权
 *       403:
 *         description: 没有管理员权限
 */

/**
 * @swagger
 * /orders/admin/{id}/refund:
 *   post:
 *     tags:
 *       - 订单管理(管理员)
 *     summary: 订单退款
 *     description: 管理员处理订单退款
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 订单ID
 *     responses:
 *       200:
 *         description: 订单已退款并取消
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *                 message:
 *                   type: string
 *                   example: 订单已退款并取消
 *       400:
 *         description: 请求参数错误或订单状态不允许退款
 *       401:
 *         description: 未授权
 *       403:
 *         description: 没有管理员权限
 *       404:
 *         description: 订单不存在
 */ 