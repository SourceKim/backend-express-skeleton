import { User } from '@/models/user.model';

// 全局声明方式
declare global {
  namespace Express {
    interface Request {
      user?: User;
      requestId?: string;
    }
  }
}

// 确保这个文件被视为模块
export {}; 