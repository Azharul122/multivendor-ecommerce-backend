
import { Router } from "express"
import { planController } from "./plan.controller"
import { checkAuth } from "../../middlewares/checkAuth"
import { Role } from "../../genereted/prisma/enums"


const router= Router()

router.post("/create",checkAuth(Role.ADMIN, Role.SUPER_ADMIN), planController.createNewPlan)

export const planService= router