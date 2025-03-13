# 商城模块

本文档描述了商城模块的设计和实现。

## 模块结构

商城模块包含以下主要组件：

1. **数据模型**
   - 商品分类 (`Category`)
   - 商品 (`Product`)
   - 订单 (`Order`) 和订单项 (`OrderItem`)
   - 购物车 (`Cart`) 和购物车项 (`CartItem`)

2. **服务层**
   - 商品服务 (`ProductService`)
   - 订单服务 (`OrderService`)
   - 购物车服务 (`CartService`)

3. **控制器**
   - 商品控制器 (`ProductController`)
   - 订单控制器 (`OrderController`)
   - 购物车控制器 (`CartController`)

4. **路由**
   - 商品路由 (`/api/v1/products`)
   - 订单路由 (`/api/v1/orders`)
   - 购物车路由 (`/api/v1/cart`)

5. **数据库迁移**
   - 创建商城相关表的迁移文件

## API 接口

### 商品模块 (Product)

#### 用户端 API

| 路由路径 | 方法 | 描述 | 权限 |
| --- | --- | --- | --- |
| `/api/v1/products/user/products` | GET | 获取商品列表（带分页和过滤） | 普通用户 |
| `/api/v1/products/user/products/:id` | GET | 获取单个商品详情 | 普通用户 |
| `/api/v1/products/user/categories` | GET | 获取所有商品分类 | 普通用户 |

#### 管理端 API

| 路由路径 | 方法 | 描述 | 权限 |
| --- | --- | --- | --- |
| `/api/v1/products/admin/products` | POST | 创建新商品 | 管理员 |
| `/api/v1/products/admin/products/:id` | PUT | 更新商品信息 | 管理员 |
| `/api/v1/products/admin/products/:id` | DELETE | 删除商品 | 管理员 |
| `/api/v1/products/admin/categories` | POST | 创建商品分类 | 管理员 |
| `/api/v1/products/admin/categories/:id` | PUT | 更新商品分类 | 管理员 |
| `/api/v1/products/admin/categories/:id` | DELETE | 删除分类 | 管理员 |

### 购物车模块 (Cart)

#### 用户端 API

| 路由路径 | 方法 | 描述 | 权限 |
| --- | --- | --- | --- |
| `/api/v1/cart/user/cart` | GET | 获取当前用户的购物车 | 普通用户 |
| `/api/v1/cart/user/cart/items` | POST | 添加商品到购物车 | 普通用户 |
| `/api/v1/cart/user/cart/items/:id` | PUT | 修改购物车项数量 | 普通用户 |
| `/api/v1/cart/user/cart/items/:id` | DELETE | 移除购物车项 | 普通用户 |
| `/api/v1/cart/user/cart/clear` | POST | 清空购物车 | 普通用户 |

#### 管理端 API

| 路由路径 | 方法 | 描述 | 权限 |
| --- | --- | --- | --- |
| `/api/v1/cart/admin/carts` | GET | 查询所有用户的购物车 | 管理员 |

### 订单模块 (Order)

#### 用户端 API

| 路由路径 | 方法 | 描述 | 权限 |
| --- | --- | --- | --- |
| `/api/v1/orders/user/orders` | POST | 创建订单 | 普通用户 |
| `/api/v1/orders/user/orders` | GET | 获取用户的所有订单 | 普通用户 |
| `/api/v1/orders/user/orders/:id` | GET | 获取订单详情 | 普通用户 |
| `/api/v1/orders/user/orders/:id/cancel` | POST | 取消订单 | 普通用户 |

#### 管理端 API

| 路由路径 | 方法 | 描述 | 权限 |
| --- | --- | --- | --- |
| `/api/v1/orders/admin/orders` | GET | 获取所有订单 | 管理员 |
| `/api/v1/orders/admin/orders/:id` | PUT | 更新订单状态 | 管理员 |
| `/api/v1/orders/admin/orders/stats` | GET | 获取订单统计信息 | 管理员 |

## 数据库表结构

### 商品分类表 (`mall_product_category`)

| 字段名 | 类型 | 描述 |
| --- | --- | --- |
| id | int | 主键 |
| name | varchar(50) | 分类名称 |
| description | text | 分类描述 |
| created_at | timestamp | 创建时间 |
| updated_at | timestamp | 更新时间 |

### 商品表 (`mall_product`)

| 字段名 | 类型 | 描述 |
| --- | --- | --- |
| id | int | 主键 |
| name | varchar(100) | 商品名称 |
| description | text | 商品描述 |
| price | decimal(10,2) | 商品价格 |
| stock | int | 库存数量 |
| status | enum | 状态：active/inactive |
| category_id | int | 所属分类ID |
| created_at | timestamp | 创建时间 |
| updated_at | timestamp | 更新时间 |

### 订单表 (`mall_order`)

| 字段名 | 类型 | 描述 |
| --- | --- | --- |
| id | int | 主键 |
| order_number | varchar(36) | 订单号 |
| user_id | int | 用户ID |
| total_price | decimal(10,2) | 订单总金额 |
| status | enum | 订单状态 |
| remark | text | 订单备注 |
| created_at | timestamp | 创建时间 |
| updated_at | timestamp | 更新时间 |

### 订单项表 (`mall_order_item`)

| 字段名 | 类型 | 描述 |
| --- | --- | --- |
| id | int | 主键 |
| order_id | int | 订单ID |
| product_id | int | 商品ID |
| quantity | int | 购买数量 |
| price | decimal(10,2) | 下单时的商品单价 |
| created_at | timestamp | 创建时间 |
| updated_at | timestamp | 更新时间 |

### 购物车表 (`mall_cart`)

| 字段名 | 类型 | 描述 |
| --- | --- | --- |
| id | int | 主键 |
| user_id | int | 用户ID |
| total_price | decimal(10,2) | 购物车总金额 |
| created_at | timestamp | 创建时间 |
| updated_at | timestamp | 更新时间 |

### 购物车项表 (`mall_cart_item`)

| 字段名 | 类型 | 描述 |
| --- | --- | --- |
| id | int | 主键 |
| cart_id | int | 购物车ID |
| product_id | int | 商品ID |
| quantity | int | 商品数量 |
| created_at | timestamp | 创建时间 |
| updated_at | timestamp | 更新时间 |

## 使用方法

1. 运行数据库迁移以创建必要的表：
   ```bash
   npm run migration:run
   ```

2. 启动应用程序：
   ```bash
   npm run dev
   ```

3. 访问 API 接口：
   - 商品列表：`GET /api/v1/products/user/products`
   - 购物车：`GET /api/v1/cart/user/cart`
   - 创建订单：`POST /api/v1/orders/user/orders` 