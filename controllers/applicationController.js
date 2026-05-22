import Application from "../models/Application.js";
import Pet from "../models/Pet.js";
import User from "../models/User.js"
import { sendMail } from "../utils/sendEmail.js"

export const applyForPet = async (req, res) =>
{
	try
	{
		const { message } = req.body;
		const petId = req.params.petId;
		const pet = await Pet.findById(petId);

		if (!pet)
		{
			return res.status(404).json({ message: "Pet not found!" })
		}

		if (pet.createdBy.toString() === req.user._id.toString())
		{
			return res.status(400).json({
				message: "You cannot apply for your own pet",
			});
		}

		// Only normal users can apply
		if (req.user.role !== "Adopter")
		{
			return res.status(403).json({ message: "Only users can apply" });
		}

		const existingApp = await Application.findOne(
			{
				user: req.user._id,
				pet: petId,
			}
		)

		if (existingApp)
		{
			return res.status(401).json({ message: "You have already applied for this Pet" })
		}

		const createPetApp = await Application.create(
			{
				user: req.user._id,
				pet: petId,
				message,
			}
		)


		//send mail
		const shelter = await User.findById(pet.createdBy)
		const user = await User.findById(req.user._id)

		await sendMail({
			to: shelter.email,
			subject: "New Adoption Application Received",
			html: `
			<h2>New application for ${pet.name} </h2>
			<p><b>Applicant:</b>${user.name}</p>
			<p><b>Message:</b>${message}</p>`

		})
		res.status(201).json({ createPetApp })
	}
	catch (error)
	{
		return res.status(500).json({ message: error.message || "Internal server error" })
	}
}


//GET USER APPLICATIONS

export const getUserApplications = async (req, res) => {
  try {

    const applications = await Application.find({
      user: req.user._id,
    })
      .populate("pet")
      .populate("user", "name email");

    res.status(200).json(applications);

  } catch (error) {
    return res.status(500).json({
      message:
        error.message || "Internal server error",
    });
  }
};



//Get Application only pets created by shelter

export const getApplicationsByShelter = async (req, res) =>
{
	try
	{
		const applications = await Application.find()
			.populate({
				path: "pet",
				select: "name images createdBy"
			})
			.populate("user", "name email");

		// SAFE FILTER (IMPORTANT)
		const filtered = applications.filter(app =>
			app.pet && app.pet.createdBy &&
			app.pet.createdBy.toString() === req.user._id.toString()
		);

		res.status(200).json(filtered);
	}
	catch (error)
	{
		return res.status(500).json({
			message: error.message || "Internal server error"
		});
	}
};


//Approve or reject updateapplicationstatus

export const updateApplicationStatus = async (req, res) =>
{
	try
	{

		const { status, responseMessage } = req.body;
		const application = await Application.findById(req.params.id).populate("pet");
		if (!application)
		{
			return res.status(404).json({ message: "Application not found" });
		}

		if (application.pet.createdBy.toString() !== req.user._id.toString())
		{
			return res.status(403).json({ message: "Not allowed" });
		}

		application.status = status;
		application.responseMessage = responseMessage || "";
		await application.save();

		//send mail to applicant
		const applicant = await User.findById(application.user)
		const pet = application.pet
		await sendMail({
			to: applicant.email,
			subject: `Application Update for ${pet.name}`,
			html: `
    <h2>Application Status Updated</h2>

    <p>
      Your application for 
      <b>${pet.name}</b>
      is now:
      <b>${status}</b>
    </p>

    <p>
      <b>Shelter Response:</b>
      ${responseMessage || "No additional message"}
    </p>
  `,
		});


		res.json(application);
	}
	catch (error)
	{
		return res.status(500).json({ message: error.message })
	}
}

//find application for particular pet

export const getApplicationsForPet = async (req, res) =>
{
	try
	{
		const petId = req.params.petId;

		// Step 1: Get pet safely
		const pet = await Pet.findById(petId);

		if (!pet)
		{
			return res.status(404).json({ message: "Pet not found" });
		}

		// Step 2: Authorization check
		if (
			pet.createdBy.toString() !== req.user._id.toString()
		)
		{
			return res.status(403).json({ message: "Not allowed" });
		}

		// Step 3: Get applications
		const applications = await Application.find({ pet: petId })
			.populate("user", "name email")
			.populate("pet", "name");

		res.json(applications);
	} catch (error)
	{
		res.status(500).json({ message: error.message });
	}
};

//just to test email

// export const testEmail = async (req, res) => {
//   try {
//     await sendMail({
//       to: "nethra@gmail.com", // change this
//       subject: "🚀 Test Email from Pet App",
//       html: "<h1>Email is working!</h1><p>If you got this, SMTP is working 🎉</p>",
//     });

//     res.json({ message: "Test email sent successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };