import env from './env';
import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import { connectToMongoDb } from './db/db';
import { logger } from './handlers/handler';
import authRoutes from './routes/authRoutes/auth.routes';
import paymentRoutes from './routes/paymentRoutes/payment.routes';
import webhookRoutes from './routes/paymentRoutes/webhook.routes';
import { errorHandler } from './middleware/error.middleware';


const app = express();

app.use(
  '/api/webhook/stripe',
  express.raw({ type: 'application/json' }),
  webhookRoutes
);

app.use(
  cors({
    origin: env.ALLOWED_ORIGINS,
    credentials: true, // Allows the server to accept cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());
app.use(cookieParser());


connectToMongoDb(env.DATABASE_URL);

app.use('/api/auth', authRoutes);

app.use('/api/payment', paymentRoutes);

app.use(errorHandler);

app.listen(env.PORT, () => {
  logger('INFO', `Server is running on port ${env.PORT}`);
});
