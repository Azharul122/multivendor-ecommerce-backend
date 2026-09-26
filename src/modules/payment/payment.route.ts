import { Router } from "express";
import { paymentController } from "./payment.controller";


const router = Router();

router.post("/subscription", paymentController.purchaseSubscription)


export const paymentRouter = router