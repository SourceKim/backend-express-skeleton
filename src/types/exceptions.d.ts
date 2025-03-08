declare module '@/exceptions/HttpException' {
  export class HttpException extends Error {
    public status: number;
    public message: string;
    constructor(status: number, message: string);
  }
} 