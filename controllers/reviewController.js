import User from "../models/User.js";
import Review from "../models/Review.js";
import Pet from "../models/Pet.js";

//craete review
export const createReview = async (req, res) =>
{
	try
	{

		const { rating, comment } = req.body;
		const shelterId = req.params.shelterId;

		const shelter = await User.findById(shelterId);

		if (!shelter || shelter.role !== "Shelter")
		{
			return res.status(404).json({ message: "Shelter not found." });
		}

		const review = await Review.create(
			{
				user: req.user._id,
				shelter: shelterId,
				rating: rating,
				comment: comment,
			}
		)

		res.status(201).json(review);

	}
	catch (error)
	{
		return res.status(500).json({ message: error.message })
	}
}


//get shelter reviews
export const getShelterReviews = async (req, res) =>
{
	try
	{
		const reviews = await Review.find({
			shelter: req.params.shelterId
		}).populate("user", "name");
		res.status(201).json(reviews);
	}
	catch (error)
	{
		return res.status(500).json({ message: error.message || "Internal server error" })
	}
}


//get average rating
export const getAvgRating = async (req, res) =>
{
	try
	{

		const reviews = await Review.find({
			shelter: req.params.shelterId
		})

		const avg = await reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)

		res.json({
			averageRating: avg.toFixed(1),
			totalReviews: reviews.length,

		})

	}
	catch (error)
	{
		return res.status(500).json({ message: error.message || "Internal server error" })
	}
}

//create pet review
export const createPetReview = async (req, res) =>
{
	try
	{
		if (req.user.role !== "Adopter")
		{
			return res.status(403).json({
				message: "Only adopters can review pets"
			});
		}

		const petId = req.params.petId;

		const pet = await Pet.findById(petId);

		const alreadyReviewed = await Review.findOne({
			user: req.user._id,
			pet: petId,
		});

		if (alreadyReviewed)
		{
			return res.status(400).json({
				message: "You already reviewed this pet"
			});
		}
		const { rating, comment } = req.body;

	

		if (!pet)
		{
			return res.status(404).json({
				message: "Pet not found",
			});
		}

		const review = await Review.create({
			user: req.user._id,
			pet: petId,
			rating,
			comment,
		});

		res.status(201).json(review);
	} catch (error)
	{
		res.status(500).json({
			message: error.message,
		});
	}
};


//get pet reviews
export const getPetReviews = async (req, res) =>
{
	try
	{
		const reviews = await Review.find({
			pet: req.params.petId,
		}).populate("user", "name");

		res.json(reviews);
	} catch (error)
	{
		res.status(500).json({
			message: error.message,
		});
	}
};


//get pet average rating
export const getPetAverageRating = async (req, res) =>
{
	try
	{
		const reviews = await Review.find({
			pet: req.params.petId,
		});

		const avg =
			reviews.reduce(
				(acc, item) => acc + item.rating,
				0
			) / (reviews.length || 1);

		res.json({
			averageRating: avg.toFixed(1),
			totalReviews: reviews.length,
		});
	} catch (error)
	{
		res.status(500).json({
			message: error.message,
		});
	}
};