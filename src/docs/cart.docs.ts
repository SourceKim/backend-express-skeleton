/**
 * @swagger
 * components:
 *   schemas:
 *     Cart:
 *       type: object
 *       required:
 *         - id
 *         - userId
 *         - productId
 *         - quantity
 *       properties:
 *         id:
 *           type: number
 *           description: 购物车项ID
 *         userId:
 *           type: string
 *           description: 用户ID
 *         productId:
 *           type: number
 *           description: 产品ID
 *         quantity:
 *           type: number
 *           minimum: 1
 *           description: 数量
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
 *
 *     AddToCartDto:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *       properties:
 *         productId:
 *           type: number
 *           description: 产品ID
 *         quantity:
 *           type: number
 *           minimum: 1
 *           description: 数量
 *
 *     UpdateCartDto:
 *       type: object
 *       required:
 *         - quantity
 *       properties:
 *         quantity:
 *           type: number
 *           minimum: 1
 *           description: 数量
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     tags:
 *       - 购物车
 *     summary: 获取购物车
 *     description: 获取当前用户的购物车
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 成功获取购物车
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Cart'
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
 *       - 购物车
 *     summary: 添加商品到购物车
 *     description: 添加商品到当前用户的购物车
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddToCartDto'
 *     responses:
 *       201:
 *         description: 商品已添加到购物车
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *                 message:
 *                   type: string
 *                   example: 商品已添加到购物车
 *       400:
 *         description: 请求参数错误或库存不足
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
 *       - 购物车
 *     summary: 清空购物车
 *     description: 清空当前用户的购物车
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 购物车已清空
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 购物车已清空
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
 * /cart/{id}:
 *   put:
 *     tags:
 *       - 购物车
 *     summary: 更新购物车商品数量
 *     description: 更新购物车中指定商品的数量
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 购物车项ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCartDto'
 *     responses:
 *       200:
 *         description: 购物车已更新
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *                 message:
 *                   type: string
 *                   example: 购物车已更新
 *       400:
 *         description: 请求参数错误或库存不足
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
 *         description: 购物车项不存在
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 购物车项不存在
 *
 *   delete:
 *     tags:
 *       - 购物车
 *     summary: 从购物车移除商品
 *     description: 从购物车中移除指定商品
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 购物车项ID
 *     responses:
 *       200:
 *         description: 商品已从购物车移除
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 商品已从购物车移除
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
 *         description: 购物车项不存在
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 购物车项不存在
 */ 