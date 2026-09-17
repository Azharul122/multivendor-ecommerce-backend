import { validateRequest } from './../../middlewares/validatRequestWithZod';
import { Router } from "express";
import { userController } from "./user.controller";
import { userValidation } from "./user.validation";

const router = Router()


router.post("/register", validateRequest(userValidation.register), userController.register)
router.post("/login", validateRequest(userValidation.login), userController.login)

export const userRouter = router