import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger-output.json' with { type: 'json' };
import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRoutes from './routes/notesRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

const PORT = process.env.PORT || 3000;

const app = express();

app.use(logger);
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(notesRoutes);
app.use(authRoutes);
app.use(userRoutes);

app.use(errors());
app.use(notFoundHandler);
app.use(errorHandler);

const start = async () => {
  await connectMongoDB();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

start();
