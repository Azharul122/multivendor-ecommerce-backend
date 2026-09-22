import { Router } from "express";
import { orderController } from "./order.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../../genereted/prisma/enums";


const router= Router()

router.post("/create", checkAuth(Role.USER, Role.SELLER),  orderController.createNewOrder)
// router.get("/all", checkAuth(Role.SELLER), orderController.getAllOrders)
router.get("/:id", checkAuth(Role.SELLER), orderController.getOrderById)
// router.patch("/:id", checkAuth(Role.SELLER), orderController.updateOrder)
// router.delete("/:id", checkAuth(Role.SELLER), orderController.deleteOrder)

export const orderRouter = router