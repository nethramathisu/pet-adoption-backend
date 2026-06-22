import mongoose from "mongoose";
const applicationSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		pet: { type: mongoose.Schema.Types.ObjectId, ref: "Pet" },
		status: {
			type: String,
			enum: [
				"Pending",
				"Info Requested",
				"Info Submitted",
				"Approved",
				"Rejected"
			],
			default: "Pending"
		},
		message: String,
		responseMessage: {
			type: String,
			default: "",
		},
		infoRequest: {
			type: String,
			default: ""
		},
		houseType: {
			type: String,
			default: ""
		},

		existingPets: {
			type: String,
			default: ""
		},

		contactNumber: {
			type: String,
			default: ""
		},

		address: {
			type: String,
			default: ""
		},
	},

	{ timestamps: true }
);
export default mongoose.model("Application", applicationSchema)