# 权限校验模块设计

基于 RBAC (Role-Based Access Control) 的权限系统，完整的 RBAC 模型：
- 用户（User    
- 角色（Role）
- 权限（Permission）
- 用户-角色关联（UserRole）

权限类型：
- 资源（Resource）
    - 用户资源 user
    - 角色资源 role
    - 素材资源 material
- 动作（Action）
    - 读取 read
    - 写入 write
    - 删除 delete

## 数据模型

- Role
    - id
    - name
    - description
    - permissions: 权限列表
    - created_at
    - updated_at
- Permission
    - id
    - name
    - resource
    - action
    - description
    - created_at
    - updated_at
- UserRole
    - id
    - user_id
    - role_id
    - created_at
    - updated_at
- User 沿用当前的用户表

## 设计

### 权限校验

使用 PermissionGuard 校验权限，PermissionGuard 是一个类，会根据请求的资源和动作，查询数据库中对应的权限，并进行校验。

为了方便使用，实现两个装饰器：
- RequireAllPermissions 装饰器，用于校验用户是否拥有所有指定的权限
- RequireAnyPermissions 装饰器，用于校验用户是否拥有至少一个指定的权限

```
@RequireAllPermissions('user:read')
aync getProfile(user_id: string) {
    return this.userService.findOne(user_id);
}
```

### 权限管理

- 权限查询 DTO
- 角色查询 DTO
- 角色分配 DTO
- 权限创建 DTO
- 角色创建 DTO
- 用户-角色关联创建 DTO


#### 默认权限 config

```
// 预定义权限
const DEFAULT_PERMISSIONS = {
    USER: {
        READ: 'user:read',
        WRITE: 'user:write',
        DELETE: 'user:delete'
    },
    CHAT: {
        READ: 'chat:read',
        WRITE: 'chat:write',
        DELETE: 'chat:delete'
    }
};

// 预定义角色
const DEFAULT_ROLES = {
    SUPER_ADMIN: {
        name: 'super_admin',
        permissions: Object.values(DEFAULT_PERMISSIONS).flatMap(p => Object.values(p))
    },
    ADMIN: {
        name: 'admin',
        permissions: [
            DEFAULT_PERMISSIONS.USER.READ,
            DEFAULT_PERMISSIONS.USER.WRITE,
            DEFAULT_PERMISSIONS.CHAT.READ,
            DEFAULT_PERMISSIONS.CHAT.DELETE
        ]
    },
    MODERATOR: {
        name: 'moderator',
        permissions: [
            DEFAULT_PERMISSIONS.USER.READ,
            DEFAULT_PERMISSIONS.CHAT.READ
        ]
    }
};
```

## 实现

1. 权限管理 routers，实现权限管理 api
2. 权限校验 PermissionGuard 实现
3. 现有的接口，使用装饰器校验权限
4. 权限报错统一 exception 实现