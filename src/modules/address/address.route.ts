import { Router } from "express";
import { addressController } from "./address.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../../genereted/prisma/enums";



const router = Router()

router.use("/create", checkAuth(Role.USER), addressController.createAddress)

export const addressRouter = router