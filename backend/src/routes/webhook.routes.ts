import stripeConnectController from "@/controllers/connect.controller";
import paymentController from "@/controllers/payment.controller";
import webhookController from "@/controllers/webhook.controller";
import { Router } from "express";
import express from "express";

const router = Router();

router.post('/',  express.raw({ type: "application/json" }),  webhookController.webhooks);

export default router;