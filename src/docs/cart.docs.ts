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
 *         user_id:
 *           type: string
 *           format: uuid
 *           description: 用户ID
 *           example: 550e8400-e29b-41d4-a716-446655440000
 *         product_id:
 *           type: string
 *           format: uuid
 *           description: 产品ID
 *           example: 550e8400-e29b-41d4-a716-446655440000
 *         quantity:
 *           type: integer
 *           description: 数量
 *           minimum: 1
 *           example: 2
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: 创建时间
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: 更新时间
 *         product:
 *           type: object
 *           description: 产品信息
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *               description: 产品ID
 *             name:
 *               type: string
 *               description: 产品名称
 *             price:
 *               type: number
 *               description: 产品价格
 *             image:
 *               type: string
 *               description: 产品图片
 *       required:
 *         - id
 *         - user_id
 *         - product_id
 *         - quantity
 *         - created_at
 *         - updated_at
 *
 *     AddToCartDto:
 *       type: object
 *       properties:
 *         product_id:
 *           type: string
 *           format: uuid
 *           description: 产品ID
 *           example: 550e8400-e29b-41d4-a716-446655440000
 *         quantity:
 *           type: integer
 *           description: 数量
 *           minimum: 1
 *           example: 2
 *       required:
 *         - product_id
 *         - quantity
 *
 *     UpdateCartDto:
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
 *   /cart:
 *     get:
 *       tags:
 *         - 购物车
 *       summary: 获取当前用户的购物车
 *       description: 获取当前登录用户的购物车内容
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
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/CartItem'
 *         401:
 *           $ref: '#/components/responses/UnauthorizedError'
 *
 *     post:
 *       tags:
 *         - 购物车
 *       summary: 添加商品到购物车
 *       description: 将商品添加到当前登录用户的购物车
 *       security:
 *         - BearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AddToCartDto'
 *       responses:
 *         201:
 *           description: 成功添加商品到购物车
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/CartItem'
 *         400:
 *           $ref: '#/components/responses/ValidationError'
 *         401:
 *           $ref: '#/components/responses/UnauthorizedError'
 *         404:
 *           $ref: '#/components/responses/NotFoundError'
 *
 *     delete:
 *       tags:
 *         - 购物车
 *       summary: 清空购物车
 *       description: 清空当前登录用户的购物车
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
 *                         type: object
 *                         properties:
 *                           message:
 *                             type: string
 *                             example: 购物车已清空
 *         401:
 *           $ref: '#/components/responses/UnauthorizedError'
 *
 *   /cart/{id}:
 *     put:
 *       tags:
 *         - 购物车
 *       summary: 更新购物车商品数量
 *       description: 更新当前登录用户购物车中指定商品的数量
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: 购物车项ID
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateCartDto'
 *       responses:
 *         200:
 *           description: 成功更新购物车商品数量
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/CartItem'
 *         400:
 *           $ref: '#/components/responses/ValidationError'
 *         401:
 *           $ref: '#/components/responses/UnauthorizedError'
 *         404:
 *           $ref: '#/components/responses/NotFoundError'
 *
 *     delete:
 *       tags:
 *         - 购物车
 *       summary: 从购物车中移除商品
 *       description: 从当前登录用户的购物车中移除指定商品
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: 购物车项ID
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
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             description: 被删除的购物车项ID
 *         401:
 *           $ref: '#/components/responses/UnauthorizedError'
 *         404:
 *           $ref: '#/components/responses/NotFoundError'
 */ 