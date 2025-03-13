/**
 * @swagger
 * paths:
 *   /cart/admin/all:
 *     get:
 *       tags:
 *         - 购物车管理
 *       summary: 获取所有用户的购物车
 *       description: 管理员获取系统中所有用户的购物车信息
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
 *       responses:
 *         200:
 *           description: 成功获取所有用户的购物车
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
 *                                   $ref: '#/components/schemas/CartItem'
 *         401:
 *           $ref: '#/components/responses/UnauthorizedError'
 *         403:
 *           $ref: '#/components/responses/ForbiddenError'
 *
 *   /cart/admin/user/{userId}:
 *     get:
 *       tags:
 *         - 购物车管理
 *       summary: 获取指定用户的购物车
 *       description: 管理员获取指定用户的购物车信息
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - in: path
 *           name: userId
 *           required: true
 *           schema:
 *             type: string
 *           description: 用户ID
 *       responses:
 *         200:
 *           description: 成功获取指定用户的购物车
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
 *         403:
 *           $ref: '#/components/responses/ForbiddenError'
 *         404:
 *           $ref: '#/components/responses/NotFoundError'
 *
 *     delete:
 *       tags:
 *         - 购物车管理
 *       summary: 清空指定用户的购物车
 *       description: 管理员清空指定用户的购物车
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - in: path
 *           name: userId
 *           required: true
 *           schema:
 *             type: string
 *           description: 用户ID
 *       responses:
 *         200:
 *           description: 成功清空指定用户的购物车
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
 *                             example: 用户购物车已清空
 *         401:
 *           $ref: '#/components/responses/UnauthorizedError'
 *         403:
 *           $ref: '#/components/responses/ForbiddenError'
 *         404:
 *           $ref: '#/components/responses/NotFoundError'
 *
 *   /cart/admin/{id}:
 *     delete:
 *       tags:
 *         - 购物车管理
 *       summary: 删除指定购物车项
 *       description: 管理员删除系统中的指定购物车项
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
 *           description: 成功删除购物车项
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
 *         403:
 *           $ref: '#/components/responses/ForbiddenError'
 *         404:
 *           $ref: '#/components/responses/NotFoundError'
 */ 