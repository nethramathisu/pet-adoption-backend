import express from "express";
import { Sendmessage,getChats,getMyChats,markMsgAsRead } from "../controllers/messageController.js";
import { protect }  from "../middleware/authmiddleware.js"


const router=express.Router();

//send sms
router.post("/",protect,Sendmessage);

//conversation
router.get("/:userId/:petId",protect,getChats);


//inbox
router.get("/",protect,getMyChats)

//mark as read
router.put("/read/:userId/:petId",protect,markMsgAsRead)


export default router;


