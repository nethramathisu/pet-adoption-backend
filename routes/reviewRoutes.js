import express from "express";
import { createReview, getAvgRating, getShelterReviews,  createPetReview,
  getPetReviews,
  getPetAverageRating,} from "../controllers/reviewController.js";
import {protect} from "../middleware/authmiddleware.js"

const router= express.Router();

router.post("/:shelterId",protect,createReview);
router.get("/:shelterId",getShelterReviews);
router.get("/:shelterId/average",getAvgRating);

router.post("/pet/:petId", protect, createPetReview);
router.get("/pet/:petId", getPetReviews);
router.get("/pet/:petId/average",getPetAverageRating);

export default router;

