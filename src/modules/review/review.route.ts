import { Router } from 'express';
import { validateRequest } from '../../middlewares/validatRequestWithZod';
import { reviewValidationSchema } from './review.validation';
import { checkAuth } from '../../middlewares/checkAuth';
import { Role } from '../../genereted/prisma/enums';
import { reviewController } from './review.controller';



const router = Router()

router.post("/create",
    checkAuth(Role.USER),
    validateRequest(reviewValidationSchema.reviewValidation)),
    reviewController.createReview

router.get("/all", reviewController.getAllReviews)

router.get("/:id", reviewController.getSingleReview)

router.delete("/:id", reviewController.deleteReview)

export const reviewRouter = router