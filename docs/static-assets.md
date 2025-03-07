# 静态资源管理 API

## 简介

静态资源管理 API 提供了对各种类型文件（图片、音频、视频、文档等）的上传、获取、更新和删除功能。

## 数据模型

静态资源的数据模型包含以下字段：

- `id`: 唯一标识符
- `filename`: 存储在服务器上的文件名
- `originalname`: 原始文件名
- `path`: 文件存储路径
- `mimetype`: 文件MIME类型
- `size`: 文件大小（字节）
- `type`: 资源类型（image, audio, video, document, other）
- `category`: 资源分类（可选）
- `description`: 资源描述（可选）
- `isPublic`: 是否公开
- `created_at`: 创建时间
- `updated_at`: 更新时间

## API 端点

### 获取资源列表

- **URL**: `/api/v1/assets`
- **方法**: `GET`
- **权限**: 无需认证
- **查询参数**:
  - `page`: 页码，默认 1
  - `limit`: 每页条数，默认 20
  - `type`: 资源类型过滤
  - `category`: 资源分类过滤
  - `keyword`: 搜索关键词
  - `isPublic`: 是否只获取公开资源
- **成功响应**:
  ```json
  {
    "code": 0,
    "message": "success",
    "data": {
      "items": [
        {
          "id": "uuid",
          "filename": "1676465463578_1234.jpg",
          "originalname": "example.jpg",
          "path": "/path/to/file.jpg",
          "mimetype": "image/jpeg",
          "size": 12345,
          "type": "image",
          "category": "avatar",
          "description": "用户头像",
          "isPublic": true,
          "url": "http://example.com/uploads/images/1676465463578_1234.jpg",
          "created_at": "2023-01-01T00:00:00Z",
          "updated_at": "2023-01-01T00:00:00Z"
        }
      ],
      "total": 100,
      "page": 1,
      "limit": 20,
      "total_pages": 5
    }
  }
  ```

### 获取资源详情

- **URL**: `/api/v1/assets/:id`
- **方法**: `GET`
- **权限**: 无需认证
- **路径参数**:
  - `id`: 资源ID
- **成功响应**:
  ```json
  {
    "code": 0,
    "message": "success",
    "data": {
      "id": "uuid",
      "filename": "1676465463578_1234.jpg",
      "originalname": "example.jpg",
      "path": "/path/to/file.jpg",
      "mimetype": "image/jpeg",
      "size": 12345,
      "type": "image",
      "category": "avatar",
      "description": "用户头像",
      "isPublic": true,
      "url": "http://example.com/uploads/images/1676465463578_1234.jpg",
      "created_at": "2023-01-01T00:00:00Z",
      "updated_at": "2023-01-01T00:00:00Z"
    }
  }
  ```

### 上传资源

- **URL**: `/api/v1/assets/upload`
- **方法**: `POST`
- **权限**: 需要认证
- **Content-Type**: `multipart/form-data`
- **请求参数**:
  - `file`: 文件数据
  - `category`: 分类（可选）
  - `description`: 描述（可选）
  - `isPublic`: 是否公开（可选，默认 false）
- **成功响应**:
  ```json
  {
    "code": 0,
    "message": "success",
    "data": {
      "id": "uuid",
      "filename": "1676465463578_1234.jpg",
      "originalname": "example.jpg",
      "path": "/path/to/file.jpg",
      "mimetype": "image/jpeg",
      "size": 12345,
      "type": "image",
      "category": "avatar",
      "description": "用户头像",
      "isPublic": true,
      "url": "http://example.com/uploads/images/1676465463578_1234.jpg",
      "created_at": "2023-01-01T00:00:00Z",
      "updated_at": "2023-01-01T00:00:00Z"
    }
  }
  ```

### 更新资源信息

- **URL**: `/api/v1/assets/:id`
- **方法**: `PUT`
- **权限**: 需要认证
- **路径参数**:
  - `id`: 资源ID
- **请求体**:
  ```json
  {
    "category": "新分类",
    "description": "新描述",
    "isPublic": true
  }
  ```
- **成功响应**:
  ```json
  {
    "code": 0,
    "message": "success",
    "data": {
      "id": "uuid",
      "filename": "1676465463578_1234.jpg",
      "originalname": "example.jpg",
      "path": "/path/to/file.jpg",
      "mimetype": "image/jpeg",
      "size": 12345,
      "type": "image",
      "category": "新分类",
      "description": "新描述",
      "isPublic": true,
      "url": "http://example.com/uploads/images/1676465463578_1234.jpg",
      "created_at": "2023-01-01T00:00:00Z",
      "updated_at": "2023-01-01T01:00:00Z"
    }
  }
  ```

### 删除资源

- **URL**: `/api/v1/assets/:id`
- **方法**: `DELETE`
- **权限**: 需要认证
- **路径参数**:
  - `id`: 资源ID
- **成功响应**:
  ```json
  {
    "code": 0,
    "message": "success",
    "data": null
  }
  ```

## 文件存储结构

上传的文件会根据类型自动分类存储到不同的子目录中：

- 图片文件: `/uploads/images/`
- 音频文件: `/uploads/audio/`
- 视频文件: `/uploads/video/`
- 文档文件: `/uploads/documents/`
- 其他文件: `/uploads/other/`

## 使用示例

### 前端上传文件示例（使用 Axios）

```javascript
const uploadFile = async (file, category, description, isPublic) => {
  const formData = new FormData();
  formData.append('file', file);
  
  if (category) formData.append('category', category);
  if (description) formData.append('description', description);
  if (isPublic !== undefined) formData.append('isPublic', isPublic);
  
  const response = await axios.post('/api/v1/assets/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`
    }
  });
  
  return response.data;
};
```

### 获取资源列表示例

```javascript
const getAssets = async (params = {}) => {
  const response = await axios.get('/api/v1/assets', { 
    params,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return response.data;
};
``` 