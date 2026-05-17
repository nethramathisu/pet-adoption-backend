import express from "express";
import { fosterAssign,getMyFosterPets,removeFoster, addFosterUpdate,getFosterUpdates, } from "../controllers/fosterController.js";
import {protect} from "../middleware/authmiddleware.js"

const router=express.Router();

//assign foster
router.post("/assign",protect,fosterAssign);

//getFosterPets 
router.get("/myfosterPets",protect,getMyFosterPets)

//remove foster
router.delete("/remove/:petId",protect,removeFoster)

//update message abt pet
router.post("/update/:petId",protect,addFosterUpdate);

//get updated msg from foster 
router.get("/updates/:petId",protect,getFosterUpdates);
export default router;