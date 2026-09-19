import { Router } from "express";
import { productController } from "./product.controller";
import { multerUpload } from "../../configs/multer";
import { validateRequest } from "../../middlewares/validatRequestWithZod";
import { ProductValidation } from "./product.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../../genereted/prisma/enums";



const router = Router()

router.post("/create", multerUpload.array("images"), validateRequest(ProductValidation),
    checkAuth(Role.SELLER),
    productController.createProduct)

router.get("/all", productController.allProducts)
router.get("/:id", productController.singleProduct)
// router.patch("/:id", multerUpload.array("images"), productController.updateProduct)
// router.delete("/:id", productController.deleteProduct)

export const productRouter = router;