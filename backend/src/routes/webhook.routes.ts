import stripeConnectController from "@/controllers/stripeControllers/connect.controller";
import paymentController from "@/controllers/stripeControllers/payment.controller";
import webhookController from "@/controllers/stripeControllers/webhook.controller";
import { Router } from "express";
import express from "express";

const router = Router();

router.post('/',  express.raw({ type: "application/json" }),  webhookController.webhooks);

export default router;