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
 *           type: number
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
 *           type: number
 *           description: 订单ID
 *         orderNo:
 *           type: string
 *           description: 订单编号
 *         userId:
 *           type: string
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
 *           type: integer
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
 *           type: integer
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