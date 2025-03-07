export class HttpException extends Error {
    status: number;
    message: string;
    error?: any;

    constructor(status: number, message: string, error?: any) {
        super(message);
        this.status = status;
        this.message = message;
        this.error = error;
        
        // 确保 Error.captureStackTrace 存在
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, HttpException);
        }
    }
} 