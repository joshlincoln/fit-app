// src/server.ts
import express, { RequestHandler } from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import mongoose from 'mongoose';
import { RegisterRoutes } from './routes/routes';
import swaggerDocument from './swagger.json';

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/fitapp';
mongoose
  .connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Register TSOA routes
RegisterRoutes(app);

// Workaround: cast swaggerUi middleware so that Express accepts it.
const serveMiddleware = swaggerUi.serve as unknown as RequestHandler;
const setupMiddleware = swaggerUi.setup(swaggerDocument) as unknown as RequestHandler;

app.use('/docs', serveMiddleware, setupMiddleware);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
