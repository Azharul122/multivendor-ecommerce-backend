import { Router } from "express";
import { addressController } from "./address.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../../genereted/prisma/enums";
import { validateRequest } from "../../middlewares/validatRequestWithZod";
import { addressValidation } from "./address.validation";



const router = Router()

router.get("/create", validateRequest(addressValidation.addressSchema), checkAuth(Role.USER), addressController.createAddress)
router.get("/all", checkAuth(Role.USER), addressController.getAllAddress)
router.get("/:id", checkAuth(Role.USER), addressController.getSingleAddress)
router.patch("/:id", checkAuth(Role.USER), addressController.updateAddress)
router.delete("/:id", checkAuth(Role.USER), addressController.deleteAddress)

export const addressRouter = router