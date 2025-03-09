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
 *         sort_by:
 *           type: string
 *           default: created_at
 *           description: 排序字段
 *         sort_order:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: DESC
 *           description: 排序方向
 *
 *     PaginatedResponse:
 *       type: object
 *       required:
 *         - items
 *         - meta
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             type: object
 *         meta:
 *           type: object
 *           required:
 *             - total
 *             - page
 *             - limit
 *             - pages
 *           properties:
 *             total:
 *               type: number
 *               description: 总记录数
 *             page:
 *               type: number
 *               description: 当前页码
 *             limit:
 *               type: number
 *               description: 每页数量
 *             pages:
 *               type: number
 *               description: 总页数
 *             sort_by:
 *               type: string
 *               description: 排序字段
 *             sort_order:
 *               type: string
 *               enum: [ASC, DESC]
 *               description: 排序方向
 *
 *     ApiResponse:
 *       type: object
 *       required:
 *         - success
 *       properties:
 *         success:
 *           type: boolean
 *           description: 是否成功
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