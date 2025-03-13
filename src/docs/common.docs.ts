/**
 * @swagger
 * components:
 *   schemas:
 *     ApiResponse:
 *       type: object
 *       properties:
 *         code:
 *           type: integer
 *           description: 响应状态码，0表示成功，其他表示失败
 *           example: 0
 *         message:
 *           type: string
 *           description: 响应消息
 *           example: 操作成功
 *         data:
 *           type: object
 *           description: 响应数据
 *         error:
 *           type: object
 *           description: 错误信息
 *       required:
 *         - code
 *
 *     PaginationQuery:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *           description: 页码，从1开始
 *           default: 1
 *           minimum: 1
 *           example: 1
 *         limit:
 *           type: integer
 *           description: 每页数量
 *           default: 20
 *           minimum: 1
 *           example: 20
 *         sort_by:
 *           type: string
 *           description: 排序字段
 *           default: created_at
 *           example: created_at
 *         sort_order:
 *           type: string
 *           description: 排序方向
 *           enum: [ASC, DESC]
 *           default: DESC
 *           example: DESC
 *
 *     PaginatedResponse:
 *       type: object
 *       properties:
 *         items:
 *           type: array
 *           description: 数据项列表
 *           items:
 *             type: object
 *         meta:
 *           type: object
 *           properties:
 *             total:
 *               type: integer
 *               description: 总数据量
 *               example: 100
 *             page:
 *               type: integer
 *               description: 当前页码
 *               example: 1
 *             limit:
 *               type: integer
 *               description: 每页数量
 *               example: 20
 *             pages:
 *               type: integer
 *               description: 总页数
 *               example: 5
 *             sort_by:
 *               type: string
 *               description: 排序字段
 *               example: created_at
 *             sort_order:
 *               type: string
 *               description: 排序方向
 *               example: DESC
 *       required:
 *         - items
 *         - meta
 *
 *   responses:
 *     UnauthorizedError:
 *       description: 未授权访问
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApiResponse'
 *           example:
 *             code: 401
 *             message: 未授权访问
 *             error: 请先登录
 *
 *     ForbiddenError:
 *       description: 禁止访问
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApiResponse'
 *           example:
 *             code: 403
 *             message: 禁止访问
 *             error: 权限不足
 *
 *     NotFoundError:
 *       description: 资源不存在
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApiResponse'
 *           example:
 *             code: 404
 *             message: 资源不存在
 *             error: 请求的资源不存在
 *
 *     ValidationError:
 *       description: 参数验证错误
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApiResponse'
 *           example:
 *             code: 400
 *             message: 参数验证错误
 *             error:
 *               - property: username
 *                 constraints:
 *                   isNotEmpty: 用户名不能为空
 */ 