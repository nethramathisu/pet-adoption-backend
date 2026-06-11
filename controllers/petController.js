import Pet from "../models/Pet.js";
import User from "../models/User.js";
import { sendMail } from "../utils/sendEmail.js";


// ================= CREATE PET =================

export const createPet = async (req, res) =>
{
	try
	{

		console.log("BODY:", req.body);
		console.log("FILES:", req.files);

		// role check
		if (req.user.role !== "Shelter")
		{
			return res.status(403).json({
				message: "Only shelters can create pets"
			});
		}

		const {
			name,
			age,
			breed,
			size,
			color,
			medicalHistory,
			location,
			status
		} = req.body;


		// validation

		if (
			!name ||
			!age ||
			!breed
		)
		{
			return res.status(400).json({
				message:
					"Name, age and breed are required"
			});
		}


		// uploaded files
		const imageUrls = Array.isArray(req.body.images)
			? req.body.images
			: req.body.images
				? [req.body.images]
				: [];

		const videoUrls = Array.isArray(req.body.videos)
			? req.body.videos
			: req.body.videos
				? [req.body.videos]
				: [];

		// create pet

		const pet = await Pet.create({
			name,
			age: Number(age),
			breed,
			size,
			color,
			medicalHistory,
			location,
			images: imageUrls,
			videos: videoUrls,
			status: status || "available",
			createdBy: req.user._id
		});


		// send emails

		try
		{

			const adopters =
				await User.find({
					role: "Adopter"
				});

			for (const adopter of adopters)
			{

				await sendMail({
					to: adopter.email,

					subject:
						`🐶 New Pet Available: ${pet.name}`,

					html: `
<div style="font-family:Arial;padding:20px">

<h2>🐾 New Pet Available!</h2>

<p>
A new pet has been listed for adoption.
</p>

<table style="border-collapse:collapse">

<tr>
<td><b>Name:</b></td>
<td>${pet.name}</td>
</tr>

<tr>
<td><b>Breed:</b></td>
<td>${pet.breed}</td>
</tr>

<tr>
<td><b>Age:</b></td>
<td>${pet.age}</td>
</tr>

<tr>
<td><b>Location:</b></td>
<td>${pet.location || "N/A"}</td>
</tr>

</table>

<br/>

<p>
Visit the platform and meet your future companion ❤️
</p>

</div>
`
				});
			}

		}
		catch (emailError)
		{

			console.log(
				"Email error:",
				emailError
			);

			// do NOT stop pet creation
		}

		return res.status(201).json({
			message:
				"Pet created successfully",
			pet
		});

	}
	catch (error)
	{

		console.log(
			"FULL ERROR:",
			error
		);

		res.status(500).json({
			message:
				error.message ||
				"Server Error"
		});
	}
};




// ================= GET PETS =================

export const getPets = async (
	req,
	res
) =>
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
			page = 1,
			limit = 10
		} = req.query;

		let filter = {};


		// filters

		if (name)
			filter.name = {
				$regex: name,
				$options: "i"
			};

		if (breed)
			filter.breed = {
				$regex: breed,
				$options: "i"
			};

		if (size)
			filter.size = {
				$regex: size,
				$options: "i"
			};

		if (location)
			filter.location = {
				$regex: location,
				$options: "i"
			};

		if (color)
			filter.color = {
				$regex: color,
				$options: "i"
			};

		if (status)
			filter.status = {
				$regex: status,
				$options: "i"
			};

		if (age)
			filter.age =
				Number(age);


		// search

		if (search)
		{

			filter.$or = [

				{
					name: {
						$regex: search,
						$options: "i"
					}
				},

				{
					breed: {
						$regex: search,
						$options: "i"
					}
				},

				{
					location: {
						$regex: search,
						$options: "i"
					}
				},

				{
					color: {
						$regex: search,
						$options: "i"
					}
				}
			];


			if (
				!isNaN(search)
			)
			{
				filter.$or.push({
					age:
						Number(search)
				});
			}
		}


		const pageNumber =
			Number(page);

		const pageSize =
			Number(limit);

		const skip =
			(pageNumber - 1)
			* pageSize;

		const totalPets =
			await Pet.countDocuments(
				filter
			);

		const pets =
			await Pet.find(
				filter
			)

				.populate(
					"createdBy",
					"name email"
				)

				.sort({
					[sortBy || "createdAt"]:
						order === "asc"
							? 1
							: -1
				})

				.skip(skip)

				.limit(
					pageSize
				);


		res.json({

			currentPage:
				pageNumber,

			totalPages:
				Math.ceil(
					totalPets /
					pageSize
				),

			totalPets,

			pets

		});

	}
	catch (error)
	{

		console.log(error);

		res.status(500).json({
			message:
				error.message
		});
	}
};




// ================= GET PET BY ID =================

export const getPetByID =
	async (req, res) =>
	{

		try
		{

			const pet =
				await Pet.findById(
					req.params.id
				)
					.populate(
						"createdBy",
						"name email"
					).populate("fosteredBy", "name email");;

			if (!pet)
			{
				return res.status(404)
					.json({
						message: "Pet not found"
					});
			}

			res.json(pet);

		}
		catch (error)
		{

			res.status(500).json({
				message: error.message
			});
		}
	};




// ================= UPDATE PET =================

export const updatePet =
	async (req, res) =>
	{

		try
		{

			const pet =
				await Pet.findById(
					req.params.id
				);

			if (!pet)
			{
				return res.status(404)
					.json({
						message: "Pet not found"
					});
			}

			if (
				pet.createdBy.toString()
				!== req.user._id.toString()
			)
			{
				return res.status(403)
					.json({
						message: "Not allowed"
					});
			}

			const updatedPet =
				await Pet.findByIdAndUpdate(
					req.params.id,
					req.body,
					{
						new: true
					}
				);

			res.json(updatedPet);

		}
		catch (error)
		{

			res.status(500).json({
				message: error.message
			});
		}
	};




// ================= DELETE =================

export const deletePetId =
	async (req, res) =>
	{

		try
		{

			const pet =
				await Pet.findById(
					req.params.id
				);

			if (!pet)
			{

				return res.status(404)
					.json({
						message: "Pet not found"
					});
			}

			await pet.deleteOne();

			res.json({
				message:
					"Pet removed successfully"
			});

		}
		catch (error)
		{

			res.status(500).json({
				message: error.message
			});
		}
	};