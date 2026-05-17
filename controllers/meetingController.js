import Meeting from "../models/Meeting.js";
import Pet from "../models/Pet.js";

export const requestMeeting = async (req, res) =>
{
	try
	{
		const { meetingDate, note } = req.body;
		const petId = req.params.petId;

		const pet = await Pet.findById(petId);

		if (!pet)
		{
			return res.status(404).json({ message: "Pet not found" })
		}

		const meeting = await Meeting.create({
			user: req.user._id,
			shelter: pet.createdBy,
			pet: petId,
			meetingDate,
			note,
		})

		res.status(201).json(meeting);
	}
	catch (error)
	{
		res.status(500).json({ message: error.message || "Internal server error" })
	}
}



//getmymeetings

export const getMyMeetings = async (req, res) =>
{
	try
	{

		const meetings = await Meeting.find({
			user: req.user._id
		}).populate("pet", "name images").populate("shelter", "name email")
		res.json(meetings)
	}
	catch (error)
	{
		res.status(500).json({ message: error.message || "Internal server error" })
	}
}


//getShelterMeetings

export const getShelterMeetings= async(req,res)=>{
	try{

		const meetings= await Meeting.find({
			shelter:req.user._id
		}).populate("user","name email").populate("pet","name images")
		res.json(meetings);
	}
	catch(error)
	{
       return res.status(500).json({message: error.message || "Internal server error"})
	}
}


//approve or reject meeting

export const updateMeetingStatus= async(req,res)=>{
	try{
				const {status}=req.body;
				const meeting= await Meeting.findById(req.params.id);

				if(!meeting)
				{
					return res.status(404).json({message:"Meeting not found!"})
				}


				if(meeting.shelter.toString() !== req.user._id.toString())
				{
                     return res.status(403).json({message:"Not allowed"})
				}

				meeting.status=status;
				await meeting.save();
				res.json(meeting);

	}
	catch(error)
	{
		res.status(500).json({message:error.message || "Internal server error"})
	}
}