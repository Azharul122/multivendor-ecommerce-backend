import { Router } from "express";
import { validateRequest } from "../../middlewares/validatRequestWithZod";
import { categoryValidation } from "./category.validation";
import { categoryController } from "./category.controller";


const router = Router()

router.post("/create", 
    validateRequest(categoryValidation.CategoryValidation), 
categoryController.createCategory)

export const categoryRouter = router