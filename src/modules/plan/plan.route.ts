
import { Router } from "express"
import { planController } from "./plan.controller"
import { checkAuth } from "../../middlewares/checkAuth"
import { Role } from "../../genereted/prisma/enums"


const router= Router()

router.post("/create",checkAuth(Role.ADMIN, Role.SUPER_ADMIN), planController.createNewPlan)
router.get("/all",  planController.getAllPlan)
router.get("/:id", planController.getSinglePlan)
router.patch("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), planController.updatePlan)
router.delete("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), planController.deletePlan)

export const planService= router