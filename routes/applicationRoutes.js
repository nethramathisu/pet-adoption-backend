import express from "express";
import { updateApplicationStatus,getApplicationsByShelter,getUserApplications, applyForPet,getApplicationsForPet} from "../controllers/applicationController.js";
import {protect} from "../middleware/authmiddleware.js"

const router = express.Router();

//user
router.post("/:petId",protect,applyForPet);
router.get("/my",protect,getUserApplications);


//shelter
router.put("/:id",protect,updateApplicationStatus);
router.get("/shelter",protect,getApplicationsByShelter)
router.get("/pet/:petId", protect, getApplicationsForPet);

// router.get("/test-email", testEmail); //just for testing

export default router;