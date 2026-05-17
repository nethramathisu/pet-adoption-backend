import nodemailer from "nodemailer";


export const sendMail = async (options) =>
{
	try
	{

		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASS,
			}
		})

		const mailOptions = {
			from: `"Pet Adoption Platform" <${process.env.EMAIL_USER}>`,
			to: options.to,
			subject: options.subject,
			html: options.html
		}

		await transporter.sendMail(mailOptions);
	}
	catch (error)
	{

		console.error("Email error:", error.message);
		throw error;

	}
}