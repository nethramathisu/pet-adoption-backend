import mongoose from "mongoose";
const applicationSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		pet: { type: mongoose.Schema.Types.ObjectId, ref: "Pet" },
		status: {
			type: String,
			enum: ["approved", "pending", "rejected", "need_more_info"],
			default: "pending"
		},
		message: String,
		responseMessage: {
			type: String,
			default: "",
		},
	},

	{ timestamps: true }
);
export default mongoose.model("Application", applicationSchema)