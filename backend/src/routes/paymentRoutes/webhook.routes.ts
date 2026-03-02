import webhookController from '../../controllers/stripeControllers/webhook.controller';
import { Router } from 'express';

const router = Router();

router.post('/', webhookController.webhooks);

export default router;
