import { validateRequest } from './../../middlewares/validatRequestWithZod';
import { Router } from "express";
import { userController } from "./user.controller";
import { userValidation } from "./user.validation";
import { ro } from 'zod/v4/locales';
import { checkAuth } from '../../middlewares/checkAuth';
import { Role } from '../../genereted/prisma/enums';

const router = Router()


router.post("/register", validateRequest(userValidation.register), userController.register)
router.post("/login", validateRequest(userValidation.login), userController.login)
router.post("/verify-email", validateRequest(userValidation.verify), userController.verifyEmail)
router.post("/forgot-password", userController.forgotPassword)
router.post("/reset-password", userController.resetPassword)
router.post("/change-password", checkAuth(Role.USER, Role.SELLER, Role.ADMIN, Role.SUPER_ADMIN), userController.changePassword)
router.post("/logout", userController.logout)
router.post("/google-login", userController.googleLogin)
router.get("/google-login-success", userController.googleLoginSuccess)
router.get("/handle-oauth-error", userController.handleOAuthError)
router.get("/me", checkAuth(Role.USER, Role.SELLER, Role.ADMIN, Role.SUPER_ADMIN), userController.getMyProfile)


export const userRouter = router