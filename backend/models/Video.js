import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    filename: {
        type: String,
        required: true,
    },
    filePath: {
        type: String,
        required: true,
    },
    fileSize: {
        type: Number,
        required: true,
    },
    duration: {
        type: Number,
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    
    },
    processingStatus: {
        type: String,
        enum: ["pending", "processing" , "completed", "failed"],
        default: "pending",
    },
    sensitivityStatus: {
        type: String,
        enum: ["pending", "safe", "flagged"],
        default: "pending",
    },
}, { timestamps: true });

const Video = mongoose.model("Video", videoSchema);

export default Video;