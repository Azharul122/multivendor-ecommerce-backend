import { Router } from "express";
import { validateRequest } from "../../middlewares/validatRequestWithZod";
import { categoryValidation } from "./category.validation";
import { categoryController } from "./category.controller";
import { multerUpload } from "../../configs/multer";


const router = Router()

router.post("/create",
    multerUpload.single("image"),
    validateRequest(categoryValidation.CategoryValidation),
    categoryController.createCategory)

router.get("/all", categoryController.getAllCategory)
router.get("/:id", categoryController.getSingleCategory)
router.put("/:id", categoryController.updateCategory)
router.delete("/:id", categoryController.deleteCategory)

export const categoryRouter = router