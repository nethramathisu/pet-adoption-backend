import Pet from "../models/Pet.js";
import User from "../models/User.js";

export const fosterAssign = async (req, res) =>
{
	try
	{

		const { petId, fosterId } = req.body;
		const pet = await Pet.findById(petId);

		if (!pet)
		{
			return res.status(404).json({ message: "Pet not found" });
		}

		if (pet.createdBy.toString() !== req.user._id.toString())
		{
			return res.status(403).json({ message: "Not Allowed" })
		}

		const fosterUser = await User.findById(fosterId)

		if (!fosterUser || fosterUser.role !== "Foster")
		{
			return res.statu(404).json({ message: "Foster not found." })
		}

		pet.fosteredBy = fosterId;
		pet.status = "fostered"

		await pet.save();

		res.status(201).json({
			message: "Fostered assigned successfully.",
			pet
		})
	}
	catch (error)
	{
		return res.status(500).json({ message: error.message || "internal server error" })
	}
}


//get my foster pets

export const getMyFosterPets = async (req, res) =>
{
	try
	{

		const pet = await Pet.find({
			fosteredBy: req.user._id,
		}).populate("createdBy", "name email")

		res.json(pet);
	}
	catch (error)
	{
		res.status(500).json({ message: error.message || "Internal server error" })
	}
}


//REMOVE foster

export const removeFoster = async (req, res) =>
{
	try
	{

		const pet = await Pet.findById(req.params.petId);

		if (!pet)
		{
			res.status(404).json({ message: "Pet not found" })
		}

		if (pet.createdBy.toString() !== req.user._id.toString())
		{
			res.status(403).json({ message: "Not allowed" });
		}

		pet.fosteredBy = null;
		pet.status = "available";

		await pet.save();

		res.json({ message: "Foster removed", pet })
	}
	catch (error)
	{
		res.status(500).json({ message: error.message || "Internal server error" })
	}
}

//foster updates about pet
export const addFosterUpdate = async (req, res) => {
  try {
    const { message } = req.body;

    const pet = await Pet.findById(req.params.petId);

    if (!pet) {
      return res.status(404).json({
        message: "Pet not found",
      });
    }

    // only assigned foster can update
    if (
      pet.fosteredBy?.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    pet.fosterUpdates.push({
      message,
      createdBy: req.user._id,
    });

    await pet.save();

    res.json({
      message: "Foster update added",
      fosterUpdates: pet.fosterUpdates,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


//GET FOSTER UPDATES
export const getFosterUpdates = async (req, res) => {
  try {
    const pet = await Pet.findById(
      req.params.petId
    ).populate(
      "fosterUpdates.createdBy",
      "name"
    );

    if (!pet) {
      return res.status(404).json({
        message: "Pet not found",
      });
    }

    res.json(pet.fosterUpdates);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};




