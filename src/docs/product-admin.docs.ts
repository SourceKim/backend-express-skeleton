/**
 * @swagger
 * paths:
 *   /admin/products:
 *     post:
 *       tags:
 *         - 商品管理
 *       summary: 创建商品
 *       description: 创建新商品
 *       security:
 *         - BearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateProductDto'
 *       responses:
 *         201:
 *           description: 成功创建商品
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/Product'
 *         400:
 *           $ref: '#/components/responses/ValidationError'
 *         401:
 *           $ref: '#/components/responses/UnauthorizedError'
 *         403:
 *           $ref: '#/components/responses/ForbiddenError'
 *
 *   /admin/products/{id}:
 *     put:
 *       tags:
 *         - 商品管理
 *       summary: 更新商品
 *       description: 更新现有商品信息
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: 商品ID
 *           schema:
 *             type: string
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateProductDto'
 *       responses:
 *         200:
 *           description: 成功更新商品
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/Product'
 *         400:
 *           $ref: '#/components/responses/ValidationError'
 *         401:
 *           $ref: '#/components/responses/UnauthorizedError'
 *         403:
 *           $ref: '#/components/responses/ForbiddenError'
 *         404:
 *           $ref: '#/components/responses/NotFoundError'
 *
 *     delete:
 *       tags:
 *         - 商品管理
 *       summary: 删除商品
 *       description: 删除指定商品
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: 商品ID
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: 成功删除商品
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
 *                             description: 被删除的商品ID
 *         401:
 *           $ref: '#/components/responses/UnauthorizedError'
 *         403:
 *           $ref: '#/components/responses/ForbiddenError'
 *         404:
 *           $ref: '#/components/responses/NotFoundError'
 *
 *   /admin/categories:
 *     post:
 *       tags:
 *         - 商品管理
 *       summary: 创建商品分类
 *       description: 创建新的商品分类
 *       security:
 *         - BearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateCategoryDto'
 *       responses:
 *         201:
 *           description: 成功创建商品分类
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/Category'
 *         400:
 *           $ref: '#/components/responses/ValidationError'
 *         401:
 *           $ref: '#/components/responses/UnauthorizedError'
 *         403:
 *           $ref: '#/components/responses/ForbiddenError'
 *
 *   /admin/categories/{id}:
 *     put:
 *       tags:
 *         - 商品管理
 *       summary: 更新商品分类
 *       description: 更新现有商品分类信息
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: 分类ID
 *           schema:
 *             type: string
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateCategoryDto'
 *       responses:
 *         200:
 *           description: 成功更新商品分类
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/Category'
 *         400:
 *           $ref: '#/components/responses/ValidationError'
 *         401:
 *           $ref: '#/components/responses/UnauthorizedError'
 *         403:
 *           $ref: '#/components/responses/ForbiddenError'
 *         404:
 *           $ref: '#/components/responses/NotFoundError'
 *
 *     delete:
 *       tags:
 *         - 商品管理
 *       summary: 删除商品分类
 *       description: 删除指定商品分类
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: 分类ID
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: 成功删除商品分类
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
 *                             description: 被删除的分类ID
 *         401:
 *           $ref: '#/components/responses/UnauthorizedError'
 *         403:
 *           $ref: '#/components/responses/ForbiddenError'
 *         404:
 *           $ref: '#/components/responses/NotFoundError'
 */ 