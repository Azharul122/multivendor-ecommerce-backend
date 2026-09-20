import { Router } from "express";
import { couponControllers } from "./coupon.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../../genereted/prisma/enums";


const router = Router()

router.post("/create", checkAuth(Role.SELLER), couponControllers.couponController)
router.post("/apply", checkAuth(Role.USER), couponControllers.applyCoupon)



export const couponRouter = router