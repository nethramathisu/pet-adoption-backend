import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) =>
{
	let token;
	if (req.headers.authorization?.startsWith("Bearer"))
	{
		try
		{
			token = req.headers.authorization.split(" ")[1];
			console.log("AUTH HEADER:", req.headers.authorization);
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			console.log("DECODED:", decoded);
			req.user = await User.findById(decoded.id).select("-password"); // removing password 
			next();
		}
		catch (error)
		{
			return res.status(401).json({ message: "User not Authorized" })
		}
	}

	if (!token)
	{
		return res.status(401).json({ message: "No Token" })
	}
}


//role based middleware
export const authorizedRole = (...roles) =>
{
	return (req, res, next) =>
	{
		if (!roles.includes(req.user.role))
		{
			return res.status(403).json({ message: "Access Denied" })
		}
		next();
	}
}