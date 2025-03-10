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
 *           type: string
 *           format: uuid
 *           description: 购物车项ID
 *         userId:
 *           type: string
 *           description: 用户ID
 *         productId:
 *           type: string
 *           format: uuid
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
 *           type: string
 *           format: uuid
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
 *       - Cart
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
 *       - Cart
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
 *       - Cart
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
 *       - Cart
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
 *       - Cart
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

/**
 * @swagger
 * /cart/admin:
 *   get:
 *     tags:
 *       - Cart(admin)
 *     summary: 获取所有用户的购物车
 *     description: 管理员获取所有用户的购物车
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
 *         description: 成功获取所有用户的购物车
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Cart'
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
 * /cart/admin/user/{userId}:
 *   get:
 *     tags:
 *       - Cart(admin)
 *     summary: 获取特定用户的购物车
 *     description: 管理员获取特定用户的购物车
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: 用户ID
 *     responses:
 *       200:
 *         description: 成功获取用户的购物车
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
 *       403:
 *         description: 没有管理员权限
 *       404:
 *         description: 用户不存在
 *
 *   delete:
 *     tags:
 *       - Cart(admin)
 *     summary: 清空特定用户的购物车
 *     description: 管理员清空特定用户的购物车
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: 用户ID
 *     responses:
 *       200:
 *         description: 用户购物车已清空
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 用户购物车已清空
 *       401:
 *         description: 未授权
 *       403:
 *         description: 没有管理员权限
 *       404:
 *         description: 用户不存在
 */

/**
 * @swagger
 * /cart/admin/{id}:
 *   delete:
 *     tags:
 *       - Cart(admin)
 *     summary: 删除特定购物车项
 *     description: 管理员删除特定购物车项
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 购物车项ID
 *     responses:
 *       200:
 *         description: 购物车项已删除
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 购物车项已删除
 *       401:
 *         description: 未授权
 *       403:
 *         description: 没有管理员权限
 *       404:
 *         description: 购物车项不存在
 */ 