import Pet from "../models/Pet.js";
import User from "../models/User.js";
import { sendMail } from "../utils/sendEmail.js";

//create Pet
export const createPet = async (req, res) =>
{
	try
	{
		if (req.user.role !== "Shelter")
		{
			return res.status(403).json({
				message: "Only shelters can create pets",
			});
		}
		const { name, age, breed, size, color, medicalHistory, images, videos, location, status } = req.body;
		const imageUrls = req.files?.images?.map(file => file?.path || file?.url || file?.secure_url) || [];
		const videoUrls = req.files?.videos?.map(file => file?.secure_url) || [];
		const pet = await Pet.create({
			name,
			age,
			breed,
			size,
			color,
			medicalHistory,
			images: imageUrls,
			videos: videoUrls,
			location,
			status: status || "available",
			createdBy: req.user._id

		},
		);

		const adopters = await User.find({
			role: "Adopter",
		});

		for (const adopter of adopters)
		{
			await sendMail({
				to: adopter.email,

				subject: `New Pet Available: ${pet.name}`,

				html: `
      <h2>New Pet Listing Added</h2>

      <p>
        A new pet is now available for adoption!
      </p>

      <ul>
        <li><b>Name:</b> ${pet.name}</li>
        <li><b>Breed:</b> ${pet.breed}</li>
        <li><b>Age:</b> ${pet.age}</li>
        <li><b>Location:</b> ${pet.location}</li>
      </ul>

      <p>
        Check the platform to learn more.
      </p>
    `,
			});
		}
		res.status(201).json({ pet })
	}
	catch (error)
	{
		console.log("FULL ERROR:", error);
		console.log("STACK:", error?.stack);

		return res.status(500).json({
			message: error.message || "Server Error"
		});
	}
}

//get all pets by filter
export const getPets = async (req, res) =>
{
	try
	{

		const {
			name,
			breed,
			age,
			size,
			location,
			color,
			status,
			search,
			sortBy,
			order,
			page,
			limit,
		} = req.query;

		let filter = {}

		//searching by attributes
		if (breed) filter.breed = { $regex: breed, $options: "i" };
		if (size) filter.size = { $regex: size, $options: "i" };
		if (location) filter.location = { $regex: location, $options: "i" };
		if (status) filter.status = { $regex: status, $options: "i" };
		if (color) filter.color = { $regex: color, $options: "i" };
		if (name) filter.name = { $regex: name, $options: "i" };
		if (age) filter.age = age;

		//searching by name or breed
		if (search)
		{
			filter.$or = [
				{
					name: { $regex: search, $options: "i" }
				},
				{
					breed: { $regex: search, $options: "i" }
				}
			]
		}

		//pagination
		const pageNumber = Number(page) || 1;
		const pageSize = Number(limit) || 10;
		const skip = (pageNumber - 1) * pageSize;

		// sorting
		const sortField = sortBy || "createdAt";
		const sortOrder = order === "asc" ? 1 : -1;

		const totalPets = await Pet.countDocuments(filter);

		//filtering
		const pets = await Pet.find(filter).populate("createdBy", "name email").sort({ [sortField]: sortOrder })
			.skip(skip)
			.limit(pageSize);;
		res.json({
			currentPage: pageNumber,
			totalPages: Math.ceil(totalPets / pageSize),
			totalPets,
			pets
		});

	}
	catch (error)
	{
		console.log("FULL ERROR:", error);
		console.log("STACK:", error?.stack);

		return res.status(500).json({
			message: error.message || "Server Error"
		});
	}
}


//getPetByID

export const getPetByID = async (req, res) =>
{
	try
	{
		const pet = await Pet.findById(req.params.id).populate("createdBy", "name email");
		if (!pet)
		{
			return res.status(404).json({ message: "Pet not found" })
		}
		res.json(pet)

	}
	catch (error)
	{
		console.log("FULL ERROR:", error);
		console.log("STACK:", error?.stack);

		return res.status(500).json({
			message: error.message || "Server Error"
		});
	}
}


//updatePet by shelter

export const updatePet = async (req, res) =>
{

	try
	{
		const pet = await Pet.findById(req.params.id);

		if (!pet)
		{
			return res.status(404).json({ message: "Pet not found" });
		}


		if (pet.createdBy.toString() !== req.user._id.toString())
		{
			return res.status(403).json({ message: "Not allowed" });
		}

		// extract uploaded files
		const imageUrls = req.files?.images?.map(file => file?.path || file?.url || file?.secure_url) || [];
		const videoUrls = req.files?.videos?.map(file => file?.secure_url || file?.url || file?.path) || [];

		//merging  with existing data
		const updatedData = { ...req.body }

		if (imageUrls.length > 0)
		{
			updatedData.images = imageUrls;
		}

		if (videoUrls.length > 0)
		{
			updatedData.videos = videoUrls;
		}

		const updatePet = await Pet.findByIdAndUpdate(
			req.params.id,
			updatedData,
			{ new: true }
		);

		res.json(updatePet)
	}
	catch (error)
	{
		console.log("FULL ERROR:", error);
		console.log("STACK:", error?.stack);

		return res.status(500).json({
			message: error.message || "Server Error"
		});
	}


}

//Delete petByID

export const deletePetId = async (req, res) =>
{
	try
	{
		const pet = await Pet.findById(req.params.id);

		if (!pet)
		{
			return res.status(404).json({ message: "Pet not found" })
		}

		if (pet.createdBy.toString() !== req.user._id.toString())
		{
			return res.status(403).json({ message: "Not allowed" })
		}

		await pet.deleteOne();
		res.json({ message: "Pet removed" })
	}
	catch (error)
	{
		console.log("FULL ERROR:", error);
		console.log("STACK:", error?.stack);

		return res.status(500).json({
			message: error.message || "Server Error"
		});
	}
}



