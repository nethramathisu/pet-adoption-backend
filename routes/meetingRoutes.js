import express from "express";
import {protect} from "../middleware/authmiddleware.js";
import { requestMeeting,getMyMeetings,getShelterMeetings,updateMeetingStatus } from "../controllers/meetingController.js";

const router = express.Router();

//request meeeting
router.post("/request/:petId",protect,requestMeeting);

//getmymetings
router.get("/user",protect,getMyMeetings)

//getsheltermeeting
router.get("/shelter",protect,getShelterMeetings)

//approve or reject
router.put("/:id",protect,updateMeetingStatus)

export default router;