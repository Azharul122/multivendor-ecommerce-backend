import { Router } from "express";
import { productController } from "./product.controller";
import { multerUpload } from "../../configs/multer";
import { validateRequest } from "../../middlewares/validatRequestWithZod";
import { ProductValidation } from "./product.validation";



const router = Router()

router.post("/create-product", multerUpload.array("images"), validateRequest(ProductValidation), productController.createProduct)

export const productRoute = router;