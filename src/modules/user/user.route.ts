import { validateRequest } from './../../middlewares/validatRequestWithZod';
import { Router } from "express";
import { userController } from "./user.controller";
import { userValidation } from "./user.validation";
import { ro } from 'zod/v4/locales';

const router = Router()


router.post("/register", validateRequest(userValidation.register), userController.register)
router.post("/login", validateRequest(userValidation.login), userController.login)
router.post("/verify-email", validateRequest(userValidation.verify), userController.verifyEmail)


export const userRouter = router