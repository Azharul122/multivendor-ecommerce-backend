import { Router } from "express";
import { userRouter } from "../modules/user/user.route";
import { categoryRouter } from "../modules/category/category.route";
import { productRouter } from "../modules/products/product.route";
import { blogRouter } from "../modules/blog/blog.route";




const router = Router()



router.use("/user", userRouter)
router.use("/category", categoryRouter)
router.use("/product", productRouter)
router.use("/blog", blogRouter)





export const indexRouter = router