import express from "express";
import
	{
		toogleFavorites, getFavorites, getMyProfile,
		updateProfile,
	} from "../controllers/userController.js";
import { protect } from "../middleware/authmiddleware.js"

const router = express.Router();
router.put("/favorites/:petId", protect, toogleFavorites);
router.get("/favorites", protect, getFavorites);
router.get("/profile", protect, getMyProfile);
router.put("/profile", protect, updateProfile);

export default router;
