/**
 * @swagger
 * paths:
 *   /admin/carts:
 *     get:
 *       tags:
 *         - 购物车管理
 *       summary: 获取所有用户的购物车
 *       description: 管理员获取所有用户的购物车信息
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
 *           name: user_id
 *           schema:
 *             type: integer
 *           description: 用户ID
 *       responses:
 *         200:
 *           description: 成功获取所有购物车
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
 *                                   $ref: '#/components/schemas/Cart'
 *         401:
 *           $ref: '#/components/responses/UnauthorizedError'
 *         403:
 *           $ref: '#/components/responses/ForbiddenError'
 */ 