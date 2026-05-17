import mongoose from "mongoose";
const reviewSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		shelter: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		rating: Number,
		comment: String,
		pet: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Pet",
		},
	},
	{ timestamps: true }
);
export default mongoose.model("Review", reviewSchema);