import { Router } from "express";
import { userRouter } from "../modules/user/user.route";
import { categoryRouter } from "../modules/category/category.route";




const router = Router()



router.use("/user", userRouter)
router.use("/category", categoryRouter)





export const indexRouter = router