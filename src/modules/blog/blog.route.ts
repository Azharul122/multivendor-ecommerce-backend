import { Router } from "express"
import { blogController } from "./blog.controller"
import { multerUpload } from "../../configs/multer"
import { checkAuth } from "../../middlewares/checkAuth"
import { Role } from "../../genereted/prisma/enums"


const router = Router()

router.post("/create/:productId", multerUpload.fields([{ name: "image", maxCount: 1 }, { name: "video", maxCount: 1 }, { name: "coverImage", maxCount: 1 }]), checkAuth(Role.SELLER, Role.ADMIN, Role.SUPER_ADMIN, Role.USER), blogController.createBlog)

export const blogRouter = router