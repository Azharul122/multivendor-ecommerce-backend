import { Router } from "express";
import { userRouter } from "../modules/user/user.route";
import { categoryRouter } from "../modules/category/category.route";
import { productRouter } from "../modules/products/product.route";




const router = Router()



router.use("/user", userRouter)
router.use("/category", categoryRouter)
router.use("/product", productRouter)





export const indexRouter = router