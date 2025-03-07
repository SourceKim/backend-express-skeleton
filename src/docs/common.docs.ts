/**
 * @swagger
 * components:
 *   schemas:
 *     PaginationQueryDto:
 *       type: object
 *       properties:
 *         page:
 *           type: number
 *           minimum: 1
 *           default: 1
 *           description: 页码
 *         limit:
 *           type: number
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *           description: 每页数量
 *
 *     PaginatedResponse:
 *       type: object
 *       required:
 *         - items
 *         - total
 *         - page
 *         - limit
 *         - totalPages
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             type: object
 *         total:
 *           type: number
 *           description: 总记录数
 *         page:
 *           type: number
 *           description: 当前页码
 *         limit:
 *           type: number
 *           description: 每页数量
 *         totalPages:
 *           type: number
 *           description: 总页数
 *
 *     ApiResponse:
 *       type: object
 *       required:
 *         - code
 *         - message
 *       properties:
 *         code:
 *           type: number
 *           description: 响应状态码
 *         message:
 *           type: string
 *           description: 响应消息
 *         data:
 *           type: object
 *           nullable: true
 *           description: 响应数据
 *         error:
 *           type: object
 *           nullable: true
 *           description: 错误信息
 */ 