// src/server.ts
import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from '../dist/swagger.json';
// Adjust the import below based on where your generated routes are located.
// If you compile your code, ensure that at runtime this file exists relative to the built output.
import { RegisterRoutes } from './routes/routes'; // or '../dist/routes/routes' if needed

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Register TSOA routes
RegisterRoutes(app);

/**
 * Wrap swaggerUi.serve in our own middleware handler.
 * swaggerUi.serve is (or returns) an array of middleware functions,
 * so we manually invoke them.
 */
app.use('/docs', (req: Request, res: Response, next: NextFunction) => {
  // swaggerUi.serve may be an array of handlers; we’ll run them sequentially.
  const serveMiddleware = swaggerUi.serve as unknown as express.RequestHandler[];
  let index = 0;
  const runNext = () => {
    if (index < serveMiddleware.length) {
      // Call the current middleware and pass runNext as next
      serveMiddleware[index++](req, res, runNext);
    } else {
      // All middleware functions have run; continue to next handler
      next();
    }
  };
  runNext();
});

// Wrap swaggerUi.setup in a handler and cast it to any
app.get('/docs', (req: Request, res: Response, next: NextFunction) => {
    const setupMiddleware = swaggerUi.setup(swaggerDocument);
    (setupMiddleware as any)(req, res, next);
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
