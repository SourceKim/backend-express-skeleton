/**
 * @swagger
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: 购物车项ID
 *           example: 550e8400-e29b-41d4-a716-446655440000
 *         product_id:
 *           type: number
 *           description: 商品ID
 *           example: 1
 *         quantity:
 *           type: integer
 *           description: 数量
 *           example: 2
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
 *
 *     Cart:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: 购物车ID
 *           example: 550e8400-e29b-41d4-a716-446655440000
 *         user_id:
 *           type: number
 *           description: 用户ID
 *           example: 1
 *         total_price:
 *           type: number
 *           format: float
 *           description: 总价
 *           example: 299.99
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CartItem'
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
 *         - user_id
 *         - total_price
 *
 *     AddCartItemDto:
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
 *     UpdateCartItemDto:
 *       type: object
 *       properties:
 *         quantity:
 *           type: integer
 *           description: 数量
 *           minimum: 1
 *           example: 3
 *       required:
 *         - quantity
 *
 * paths:
 *   /user/cart:
 *     get:
 *       tags:
 *         - 购物车
 *       summary: 获取当前用户的购物车
 *       description: 获取当前登录用户的购物车信息，包含购物车项
 *       security:
 *         - BearerAuth: []
 *       responses:
 *         200:
 *           description: 成功获取购物车
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/Cart'
 *         401:
 *           $ref: '#/components/responses/UnauthorizedError'
 *
 *   /user/cart/items:
 *     post:
 *       tags:
 *         - 购物车
 *       summary: 添加商品到购物车
 *       description: 向当前用户的购物车中添加商品
 *       security:
 *         - BearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AddCartItemDto'
 *       responses:
 *         200:
 *           description: 成功添加商品到购物车
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/Cart'
 *         400:
 *           $ref: '#/components/responses/ValidationError'
 *         401:
 *           $ref: '#/components/responses/UnauthorizedError'
 *         404:
 *           description: 商品不存在
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiResponse'
 *               example:
 *                 code: 404
 *                 message: 商品不存在
 *
 *   /user/cart/items/{id}:
 *     put:
 *       tags:
 *         - 购物车
 *       summary: 更新购物车项
 *       description: 更新购物车中指定商品的数量
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: 购物车项ID
 *           schema:
 *             type: string
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateCartItemDto'
 *       responses:
 *         200:
 *           description: 成功更新购物车项
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/Cart'
 *         400:
 *           $ref: '#/components/responses/ValidationError'
 *         401:
 *           $ref: '#/components/responses/UnauthorizedError'
 *         404:
 *           description: 购物车项不存在
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiResponse'
 *               example:
 *                 code: 404
 *                 message: 购物车项不存在
 *
 *     delete:
 *       tags:
 *         - 购物车
 *       summary: 从购物车中移除商品
 *       description: 从当前用户的购物车中移除指定的商品
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: 购物车项ID
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: 成功从购物车中移除商品
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/Cart'
 *         401:
 *           $ref: '#/components/responses/UnauthorizedError'
 *         404:
 *           description: 购物车项不存在
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiResponse'
 *               example:
 *                 code: 404
 *                 message: 购物车项不存在
 *
 *   /user/cart/clear:
 *     post:
 *       tags:
 *         - 购物车
 *       summary: 清空购物车
 *       description: 清空当前用户的购物车
 *       security:
 *         - BearerAuth: []
 *       responses:
 *         200:
 *           description: 成功清空购物车
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/Cart'
 *         401:
 *           $ref: '#/components/responses/UnauthorizedError'
 */ 