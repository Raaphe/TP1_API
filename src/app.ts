import express, { Request, Response, NextFunction } from 'express';
import protectedProductsRoute from "./routes/product_protected.route";
import os from 'node:os';
import path from 'path';
import productRoutes from './routes/product.route';
import authRoutes from './routes/auth.route';
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
const app = express();
const version1 = 1;
const version2 = 2;

export const api_prefix_v1 = `/api/v${version1}`;
export const api_prefix_v2 = `/api/v${version2}`;

// Step 2. Middleware for JSON parsing
app.use(express.json());
const IP_ADDR = getLocalIPAddress();

// Step 3. Define Swagger options for version 1
const swaggerOptionsV1 = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Your API v1',
      version: '1.0.0',
      description: 'API v1 documentation with JWT authentication',
    },
    servers: [
      {
        url: `https://${IP_ADDR}:3000`,
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
  apis: [path.resolve(__dirname, './routes/*.route.ts')], // Include relevant v1 routes here
};

// Step 3a. Define Swagger options for version 2
const swaggerOptionsV2 = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Your API v2',
      version: '2.0.0',
      description: 'API v2 documentation with JWT authentication',
    },
    servers: [
      {
        url: `https://${IP_ADDR}:3000`,
        description: "Development server (HTTPS) for v2"
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
  apis: [path.resolve(__dirname, './routes/*v2.route.ts')], // Include relevant v2 routes here
};

// Step 4. Generate documentation from options
const swaggerDocsV1 = swaggerJsdoc(swaggerOptionsV1);
const swaggerDocsV2 = swaggerJsdoc(swaggerOptionsV2);

// Step 5. Serve Swagger documentation at '/api/v1/docs' and '/api/v2/docs'
app.use(
  api_prefix_v1 + '/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocsV1, {
    swaggerOptions: {
      persistAuthorization: true // Ensure the JWT token persists in Swagger UI
    }
  })
);

app.use(
  api_prefix_v2 + '/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocsV2, {
    swaggerOptions: {
      persistAuthorization: true // Ensure the JWT token persists in Swagger UI
    }
  })
);

app.get('/', (req: Request, res: Response) => {
  res.send(`
    <h1>Welcome to my Backend</h1>
  `);
});

// Middleware to protect routes with authentication
app.use(api_prefix_v1, filter.authFilter, protectedProductsRoute);

// Route registrations for v1 and v2
app.use(api_prefix_v1, productRoutes);
app.use(api_prefix_v1, authRoutes);

// Assuming similar logic for v2 if necessary
// app.use(api_prefix_v2, someV2Routes);

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
