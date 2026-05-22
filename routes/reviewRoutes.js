import express from "express";
import {
  createReview,
  getAvgRating,
  getShelterReviews,
  createPetReview,
  getPetReviews,
  getPetAverageRating,
} from "../controllers/reviewController.js";
import { protect } from "../middleware/authmiddleware.js";

const router = express.Router();

/* ================= PET REVIEWS (PUT FIRST) ================= */
router.post("/pet/:petId", protect, createPetReview);
router.get("/pet/:petId/average", getPetAverageRating);
router.get("/pet/:petId", getPetReviews);

/* ================= SHELTER REVIEWS ================= */
router.post("/:shelterId", protect, createReview);
router.get("/:shelterId/average", getAvgRating);
router.get("/:shelterId", getShelterReviews);

export default router;