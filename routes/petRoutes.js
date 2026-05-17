import express from "express";
import { createPet,getPetByID,getPets,updatePet,deletePetId } from "../controllers/petController.js";
import { protect } from "../middleware/authmiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router= express.Router();

router.get("/",getPets);
router.get("/:id",getPetByID)

//protected by shelter
router.post("/",protect, upload.fields([
    { name: "images", maxCount: 5 },
    { name: "videos", maxCount: 2 }
  ]),createPet);
router.put("/:id",protect,upload.fields([
    { name: "images", maxCount: 5 },
    { name: "videos", maxCount: 2 }
  ]),updatePet);
router.delete("/:id",protect,deletePetId)


export default router;


