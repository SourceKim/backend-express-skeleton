import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'projectname API',
    version: '1.0.0',
    description: 'projectname 的 API 文档',
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
    contact: {
      name: 'API Support',
      email: 'support@xxx.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000/api/v1',
      description: '开发服务器',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
};

const options: swaggerJSDoc.Options = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts', './src/models/*.ts', './src/docs/*.ts'], // 添加 docs 目录
};

export const swaggerSpec = swaggerJSDoc(options); 