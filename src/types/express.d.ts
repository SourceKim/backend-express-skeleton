import { User } from '@/models/user.model';

// 扩展Express的Request接口，添加user属性
declare namespace Express {
  export interface Request {
    user?: User;
  }
} 