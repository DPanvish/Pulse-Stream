import express from "express";
import { uploadVideo, getVideos, getVideoById } from "../controllers/videoController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import multer from "multer";

const router = express.Router();
const upload = multer({dest: "uploads/"});

router.get("/", protect, getVideos);

router.post(
    "/upload",
    protect,
    authorize("admin", "editor"),
    upload.single("video"),
    uploadVideo
);

router.get("/:id", protect, getVideoById);

export default router;