import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { HttpException } from '@/exceptions/HttpException';

/**
 * 模型验证中间件
 * 用于验证模型数据是否符合规则
 * @param model 要验证的模型实例
 */
export const validateModel = async (model: any): Promise<void> => {
  const errors = await validate(model);
  if (errors.length > 0) {
    const message = errors
      .map(error => Object.values(error.constraints || {}))
      .flat()
      .join(', ');
    throw new HttpException(400, message);
  }
}; 