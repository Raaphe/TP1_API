import express, { Request, Response, NextFunction } from 'express';
import protectedProductsRouteV1 from "./routes/v1/product_protected.route";
import protectedProductsRouteV2 from "./routes/v2/product_protected.v2.route";
import os from 'node:os';
import path from 'path';
import productRoutesV2 from './routes/v2/product.v2.route';
import productRoutesV1 from './routes/v1/product.route';
import authRoutes from './routes/v2/auth.route';
import { errorMiddleware } from './middlewares/error.middleware';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import AuthenticationFilter from './middlewares/auth.middleware';
import { config } from './config/config';
import { ModelContext } from './models/jsonModel/ModelContext';
import { logger } from './utils/logger';

// Step 1. Create an instance of AuthenticationFilter
const filter = new AuthenticationFilter();
const util = new ModelContext("src/models/jsonModel/data.json");

const version1 = 1;
const version2 = 2;

const app = express();

export const api_prefix_v1 = `/api/v${version1}`;
export const api_prefix_v2 = `/api/v${version2}`;

const router = express.Router();

// Step 2. Middleware for JSON parsing
app.use(express.json());

const IP_ADDR = getLocalIPAddress();

// Step 3. Define Swagger options for version 1
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Your API v1',
      version: '1.0.0',
      description: 'API v1 documentation with JWT authentication',
    },
    servers: [
      {
        url: `https://${IP_ADDR}:3000/${api_prefix_v1}`,
        description: "Development server (HTTPS) for v1"
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
        bearerAuth: [],
      },
    ],
  },
  apis: [path.resolve(__dirname, './routes/v1/*.route.ts'), path.resolve(__dirname, './routes/v2/*.route.ts')], 
};

app.use(`/api/docs`, swaggerUi.setup(swaggerOptions));

app.get('/', (req: Request, res: Response) => {
  res.send(`
    <h1>Welcome to my Backend</h1>
  `);
});

app.use('/api/docs', router);


// V1
app.use(api_prefix_v1, filter.authFilter, protectedProductsRouteV1);
app.use(api_prefix_v1, protectedProductsRouteV1);

// V2
app.use(api_prefix_v2, filter.authFilter, protectedProductsRouteV2);
app.use(api_prefix_v2, protectedProductsRouteV2);

// BOTH
app.use("/api", authRoutes);

// Step 8. Error middleware for handling errors globally
app.use(errorMiddleware);

// Step 9. HTTPS server options
logger.info(config.CERT_CERT);

// Step 11. Graceful shutdown handler
process.on('SIGINT', async () => {
  console.log('Caught interrupt signal (Ctrl + C). Shutting down gracefully...');

  try {
    await ModelContext.emptyJson();  // Ensure that this completes; invoke as a static method if it's static
    console.log('ModelContext emptied successfully.');
  } catch (error) {
    console.error('Error while emptying ModelContext:', error);
  }

  process.exit(0);  // Exit the process after emptyJson finishes
});

function getLocalIPAddress() {
  const networkInterfaces = os.networkInterfaces();
  for (const interfaceName in networkInterfaces) {
    const addresses = networkInterfaces[interfaceName];
    for (const address of addresses ?? []) {
      if (address.family === 'IPv4' && !address.internal) {
        return address.address;
      }
    }
  }
  return 'IP address not found';
}

export default app;
