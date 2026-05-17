import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	name: String,
	email:
	{
		type: String, unique: true
	},
	password: String,
	role:
	{
		type: String,
		enum: ["Adopter", "Shelter", "Foster"],
		default: "Adopter",
	},
	phone: String,
	address: String,
	favorites: {
		type: [mongoose.Schema.Types.ObjectId],
		ref: "Pet",
		default: [],
	},
	profilePic: {
		type: String,
	},
},
	{ timestamps: true }
);

export default mongoose.model("User", userSchema);