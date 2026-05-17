import multer from "multer";
import * as cloudinaryStorage from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const CloudinaryStorage =
	cloudinaryStorage.CloudinaryStorage ||
	cloudinaryStorage.default;
const storage = new CloudinaryStorage({
	cloudinary,
	params: {
		folder: "pets",
		resource_type: "auto",
		allowed_formats: ["jpg", "png", "jpeg", "mp4", "mov"]
	}
});

const upload = multer({
	storage, limits: {
		fileSize: 20 * 1024 * 1024 // 20MB max
	}
});

export default upload;















