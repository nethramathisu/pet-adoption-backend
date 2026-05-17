import Message from "../models/Message.js";
import Pet from "../models/Pet.js"
import mongoose from "mongoose";
//sending message
export const Sendmessage = async (req, res) =>
{
	try
	{
		const { receiver, petId, message, } = req.body;

		//verify message
		if (!message)
		{
			return res.status(400).json({ message: "Message is required!" })
		}

		//verify pet
		const pet = await Pet.findById(petId);

		const allowedReceivers = [
			pet.createdBy?.toString(),
		];

		if (pet.fosteredBy)
		{
			allowedReceivers.push(
				pet.fosteredBy.toString()
			);
		}

		if (!allowedReceivers.includes(receiver))
		{
			return res.status(403).json({
				message: "Invalid receiver",
			});
		}

		if (!pet)
		{
			return res.status(404).json({ message: "Pet not found" })
		}

		if (receiver === req.user._id.toString())
		{
			return res.status(400).json({
				message: "You cannot message yourself",
			});
		}
		const newMessage = await Message.create({
			sender: req.user._id,
			receiver,
			message,
			pet: new mongoose.Types.ObjectId(petId),
		})

		res.status(201).json(newMessage)
	}
	catch (error)
	{
		return res.status(500).json({ message: error.message });
	}
}


//get chats b/w 2 users

export const getChats = async (req, res) =>
{
	try
	{
		const { userId, petId } = req.params;

		console.log("PARAM userId:", userId);
		console.log("PARAM petId:", petId);
		console.log("TYPE userId:", typeof userId);
		console.log("TYPE petId:", typeof petId);
		const messages = await Message.find({
			pet: new mongoose.Types.ObjectId(petId),
			$or: [
				{
					sender: req.user._id,
					receiver: new mongoose.Types.ObjectId(userId),
				},
				{
					sender: new mongoose.Types.ObjectId(userId),
					receiver: req.user._id,
				},
			]
		}).sort({ createdAt: 1 }).populate("sender", "name").populate("receiver", "name");
		res.json(messages)
	}
	catch (error)
	{
		return res.status(500).json({ message: error.message || "Internal server error" });
	}
}


//get all user chats

export const getMyChats = async (req, res) =>
{
	try
	{
		const chat = await Message.find({
			$or: [{
				sender: req.user._id
			},
			{
				receiver: req.user._id,
			}]
		})
			.populate("sender", "name")
			.populate("receiver", "name")
			.populate("pet", "name images")
			.sort({ createdAt: -1 });

		res.json(chat)
	}
	catch (error)
	{
		return res.status(500).json({ message: error.message || "Internal server error" })
	}
}

//mark messages as read

export const markMsgAsRead = async (req, res) =>
{
	try
	{
		const { userId, petId } = req.params;
		await Message.updateMany(
			{
				sender: userId,
				receiver: req.user._id,
				pet: petId,
				read: false
			},
			{ $set: { read: true } }
		)

		res.status(201).json({ message: "Meesage marked as read" })
	}
	catch (error)
	{
		return res.status(500).json({ message: error.message || "Internal server error" })
	}

}