import User from "../models/User.js"
import Pet from "../models/Pet.js";
import bcrypt from "bcryptjs";

//toggle favorites
export const toogleFavorites = async (req, res) =>
{
	try
	{
		const user = await User.findById(req.user._id)
		if (!user.favorites)
		{
			user.favorites = [];
		}
		const petId = req.params.petId;



		const petExists = await Pet.findById(petId);

		if (!petExists)
		{
			return res.status(404).json({ message: "Pet not found" })
		}

		const isFavorites = user.favorites.some(
			(id) => id.toString() === petId
		);


		if (isFavorites)
		{
			user.favorites = user.favorites.filter((id) => id.toString() !== petId)

		}
		else
		{
			user.favorites.push(petId);
		}

		await user.save();

		res.json({
			message: isFavorites ? "Removed from favorite" : "Added to favorite",
			favorites: user.favorites,
		})


	}
	catch (error)
	{
		return res.status(500).json({ message: error.message })
	}
}



//get favorites
export const getFavorites = async (req, res) =>
{
	try
	{
		const user = await User.findById(req.user._id).populate("favorites");
		res.json(user.favorites)
	}
	catch (error)
	{
		return res.status(500).json({ message: error.message || "Internal server error" })
	}
}


//get my profile
export const getMyProfile = async (req, res) =>
{
	try
	{
		const user = await User.findById(req.user._id)
			.select("-password")
			.populate("favorites");

		if (!user)
		{
			return res.status(404).json({
				message: "User not found",
			});
		}

		res.json(user);
	} catch (error)
	{
		res.status(500).json({
			message: error.message,
		});
	}
};

//update profile
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const {
      name,
      email,
      phone,
      address,
      profilePic,
      password,
    } = req.body;

    // update fields
    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.address = address || user.address;
    user.profilePic = profilePic || user.profilePic;

    // password update
    if (password) {
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(
        password,
        salt
      );
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      address: updatedUser.address,
      profilePic: updatedUser.profilePic,
      role: updatedUser.role,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};