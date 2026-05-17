import mongoose from "mongoose";
const petSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true
		},
		age: { type: Number, required: true },
		breed: { type: String, required: true },
		size: String,
		color: String,
		medicalHistory: String,
		images: [String],
		videos: [String],
		location: String,
		status: {
			type: String,
			enum: ["available", "adopted", "fostered"],
			default: "available",
		},
		fosteredBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			default: null,
		},
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		fosterUpdates: [
			{
				message: {
					type: String,
					required: true,
				},

				createdBy: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
				},

				createdAt: {
					type: Date,
					default: Date.now,
				},
			},
		],
	},
	{ timestamps: true }
)

export default mongoose.model("Pet", petSchema)