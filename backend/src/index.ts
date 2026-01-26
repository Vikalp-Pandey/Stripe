import env from './env';
import cors from 'cors';
import express from 'express';
import { connectToMongoDb } from './db/db';
import { logger } from './handlers/handler';
import paymentRoutes from './routes/payment.routes';
import webhookRoutes from './routes/webhook.routes';

const app = express();

app.use('/api/webhooks',webhookRoutes);

app.use(express.json());

app.use(
  cors({
    origin: env.ALLOWED_ORIGINS,
    credentials: true,
  })
);

connectToMongoDb(env.DATABASE_URL);

app.use('/api/payment',paymentRoutes);

app.listen(env.PORT, () => {
  logger("INFO",`Server is running on port ${env.PORT}`);
});
