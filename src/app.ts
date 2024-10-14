import express, { Request, Response, NextFunction } from 'express';
import protectedProductsRoute from "./routes/product_protected.route";
import https from 'https';
import fs from 'fs';
import path from 'path';
import productRoutes from './routes/product.route';
import authRoutes from './routes/auth.route';
import { errorMiddleware } from './middlewares/error.middleware';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import AuthenticationFilter from './middlewares/auth.middleware';
import { config } from './config/config';
import { ModelContext } from './models/ModelContext';

// Step 1. Create an instance of AuthenticationFilter
const filter = new AuthenticationFilter();
const util = new ModelContext("src/models/data.json");
const app = express();
const version = 1;
export const api_prefix = `/api/v${version}`;

// Step 2. Middleware for JSON parsing
app.use(express.json());

// Step 3. Define Swagger options
const swaggerOptions = {
  definition: { 
    openapi: '3.0.0',
    info: {
      title: 'Your API',
      version: '1.0.0',
      description: 'API documentation with JWT authentication',
    },
    servers: [
      {
        url: "https://localhost:3000",
        description: "Development server (HTTPS)"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {  
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
  },
  apis: [path.resolve(__dirname, './routes/*.route.ts')], 
};

// Step 4. Generate documentation from options
const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Step 5. Serve Swagger documentation at '/api-docs'
app.use(
  api_prefix+'/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, {
    swaggerOptions: {
      persistAuthorization: true
    }
  })
);

app.get('/', (req: Request, res: Response) => {
  res.send(`
    <h1>Welcome to my Backend</h1>
  `);
});

app.use(api_prefix, productRoutes);
app.use(api_prefix, authRoutes);

app.use(api_prefix, filter.authFilter, filter.authorizeRole('Manager'), protectedProductsRoute );

// Step 8. Error middleware for handling errors globally
app.use(errorMiddleware);

// Step 9. HTTPS server options
const httpsOptions: https.ServerOptions = {
  key: fs.readFileSync(path.resolve(__dirname, config.CERT_KEY || 'config/certificates/key.pem')),
  cert: fs.readFileSync(path.resolve(__dirname, config.CERT_CERT || 'config/certificates/cert.pem')),
};

// Step 10. Create and start the HTTPS server
const port = config.PORT || 3000; 
https.createServer(httpsOptions, app).listen(port, () => {
  console.log(`Server is running on https://localhost:${port}`);
});

// Step 11. Graceful shutdown handler
process.on('SIGINT', async () => {
  console.log('Caught interrupt signal (Ctrl + C). Shutting down gracefully...');

  try {
    await ModelContext.emptyJson();  
    console.log('ModelContext emptied successfully.');
  } catch (error) {
    console.error('Error while emptying ModelContext:', error);
  }

  process.exit(0);  
});

export default app;