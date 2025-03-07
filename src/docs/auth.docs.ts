/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags:
 *       - 认证
 *     summary: 用户注册
 *     description: 创建新用户账号
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - email
 *             properties:
 *               username:
 *                 type: string
 *                 description: 用户名
 *                 minLength: 3
 *                 maxLength: 100
 *               password:
 *                 type: string
 *                 description: 密码
 *                 minLength: 6
 *               email:
 *                 type: string
 *                 format: email
 *                 description: 邮箱
 *               phone:
 *                 type: string
 *                 description: 手机号
 *               nickname:
 *                 type: string
 *                 description: 昵称
 *               avatar:
 *                 type: string
 *                 description: 头像URL
 *               bio:
 *                 type: string
 *                 description: 用户简介
 *                 maxLength: 500
 *     responses:
 *       200:
 *         description: 注册成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         username:
 *                           type: string
 *                         email:
 *                           type: string
 *                         nickname:
 *                           type: string
 *                         status:
 *                           type: string
 *                         is_active:
 *                           type: boolean
 *                         created_at:
 *                           type: string
 *                           format: date-time
 *                         updated_at:
 *                           type: string
 *                           format: date-time
 *       400:
 *         description: 参数错误
 *       409:
 *         description: 用户已存在
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - 认证
 *     summary: 用户登录
 *     description: 用户登录并获取访问令牌
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: 用户名
 *               password:
 *                 type: string
 *                 description: 密码
 *     responses:
 *       200:
 *         description: 登录成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     access_token:
 *                       type: string
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         username:
 *                           type: string
 *                         email:
 *                           type: string
 *                         nickname:
 *                           type: string
 *                         status:
 *                           type: string
 *                         is_active:
 *                           type: boolean
 *       401:
 *         description: 用户名或密码错误
 */

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     tags:
 *       - 认证
 *     summary: 获取用户信息
 *     description: 获取当前登录用户的详细信息
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 成功获取用户信息
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         username:
 *                           type: string
 *                         email:
 *                           type: string
 *                         phone:
 *                           type: string
 *                         nickname:
 *                           type: string
 *                         avatar:
 *                           type: string
 *                         bio:
 *                           type: string
 *                         merit_points:
 *                           type: number
 *                         meditation_minutes:
 *                           type: number
 *                         status:
 *                           type: string
 *                         is_active:
 *                           type: boolean
 *                         created_at:
 *                           type: string
 *                           format: date-time
 *                         updated_at:
 *                           type: string
 *                           format: date-time
 *                         settings:
 *                           type: object
 *                           properties:
 *                             theme:
 *                               type: string
 *                             language:
 *                               type: string
 *                             notifications:
 *                               type: boolean
 *       401:
 *         description: 未授权
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterDto:
 *       type: object
 *       required:
 *         - username
 *         - password
 *         - email
 *       properties:
 *         username:
 *           type: string
 *           description: 用户名
 *           minLength: 3
 *           maxLength: 100
 *         password:
 *           type: string
 *           description: 密码
 *           minLength: 6
 *         email:
 *           type: string
 *           format: email
 *           description: 邮箱
 *         phone:
 *           type: string
 *           description: 手机号
 *           nullable: true
 *         nickname:
 *           type: string
 *           description: 昵称
 *           nullable: true
 *         avatar:
 *           type: string
 *           description: 头像URL
 *           nullable: true
 *         bio:
 *           type: string
 *           description: 用户简介
 *           maxLength: 500
 *           nullable: true
 *
 *     LoginDto:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: 用户名
 *         password:
 *           type: string
 *           description: 密码
 *
 *     RegisterResponseDto:
 *       type: object
 *       properties:
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               description: 用户ID
 *             username:
 *               type: string
 *               description: 用户名
 *             email:
 *               type: string
 *               description: 邮箱
 *             nickname:
 *               type: string
 *               description: 昵称
 *             status:
 *               type: string
 *               description: 状态
 *             is_active:
 *               type: boolean
 *               description: 是否激活
 *             created_at:
 *               type: string
 *               format: date-time
 *               description: 创建时间
 *             updated_at:
 *               type: string
 *               format: date-time
 *               description: 更新时间
 *
 *     LoginResponseDto:
 *       type: object
 *       properties:
 *         access_token:
 *           type: string
 *           description: 访问令牌
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               description: 用户ID
 *             username:
 *               type: string
 *               description: 用户名
 *             email:
 *               type: string
 *               description: 邮箱
 *             nickname:
 *               type: string
 *               description: 昵称
 *             status:
 *               type: string
 *               description: 状态
 *             is_active:
 *               type: boolean
 *               description: 是否激活
 *
 *     ProfileResponseDto:
 *       type: object
 *       properties:
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               description: 用户ID
 *             username:
 *               type: string
 *               description: 用户名
 *             email:
 *               type: string
 *               description: 邮箱
 *             phone:
 *               type: string
 *               description: 手机号
 *             nickname:
 *               type: string
 *               description: 昵称
 *             avatar:
 *               type: string
 *               description: 头像
 *             bio:
 *               type: string
 *               description: 简介
 *             merit_points:
 *               type: number
 *               description: 功德点
 *             meditation_minutes:
 *               type: number
 *               description: 冥想时长（分钟）
 *             status:
 *               type: string
 *               description: 状态
 *             is_active:
 *               type: boolean
 *               description: 是否激活
 *             created_at:
 *               type: string
 *               format: date-time
 *               description: 创建时间
 *             updated_at:
 *               type: string
 *               format: date-time
 *               description: 更新时间
 *             settings:
 *               type: object
 *               properties:
 *                 theme:
 *                   type: string
 *                   description: 主题
 *                 language:
 *                   type: string
 *                   description: 语言
 *                 notifications:
 *                   type: boolean
 *                   description: 通知开关
 */ 