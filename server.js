import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js"
import petRoutes from "./routes/petRoutes.js"
import applicationRoutes from "./routes/applicationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import fosterRoutes from "./routes/fosterRoutes.js";
import meetingRoutes from "./routes/meetingRoutes.js"

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://pet-adoption-we.netlify.app"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cache-Control", "Pragma", "Expires"]
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/pet", petRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/user", userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/foster", fosterRoutes);
app.use("/api/meetings", meetingRoutes);

app.get("/", (req, res) => {
	res.send("Pet adoption loading");
});

// ✅ Health check — wakes up Render on first load
app.get("/health", (req, res) => {
	res.sendStatus(200);
});

app.use((req, res, next) => {
  if (req.method === "GET") {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");
  }
  next();
});

app.use((err, req, res, next) => {
	console.log("GLOBAL ERROR:", err);
	res.status(500).json({
		message: err.message,
		stack: err.stack
	});
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`server is running on PORT ${PORT}`);
});