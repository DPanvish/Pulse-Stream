import express from "express";
import { uploadVideo, getVideos, getVideoById } from "../controllers/videoController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { storage } from "../config/cloudinary.js";
import multer from "multer";

const upload = multer({ storage });
const router = express.Router();

router.get("/", protect, getVideos);
router.post("/upload", protect, authorize("admin", "editor"), upload.single("video"), uploadVideo);
router.get("/:id", protect, getVideoById);

export default router;