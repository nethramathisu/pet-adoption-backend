import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema({
	user:{
		type:mongoose.Schema.Types.ObjectId,
		ref:"User",
		required:true
	},

	shelter:{
		type: mongoose.Schema.Types.ObjectId,
		ref:"User",
		required:true
	},

	pet:{
		type:mongoose.Schema.Types.ObjectId,
		ref:"Pet",
		required:true
	},
	
	meetingDate:{
		type:Date,
		required:true,
	},

	status:{
		type:String,
		enum:["pending","approved","rejected"],
		default:"pending"
	},
	
	note:{
		type:String
	}
},
{timestamps:true}
);

export default mongoose.model("Meeting",meetingSchema)