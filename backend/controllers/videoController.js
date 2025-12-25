import Video from "../models/Video.js";

const simulateProcessing = async(videoId, io) => {
    console.log(`Starting mock processing for video ${videoId}...`);

    setTimeout(async() => {
        try{
            const isSafe = Math.random() > 0.2;
            const status = isSafe ? "safe" : "flagged";

            const video = await Video.findById(videoId);
            if(video){
                video.sensitivityStatus = status;
                video.processingStatus = "completed";
                await video.save();

                io.emit("video_processed", {
                    videoId,
                    status,
                    processingStatus: "completed",
                });

                console.log(`Video ${videoId} processed: ${status}`);
            }
        }catch(err){
            console.error("Processing error:", err);
        }
    }, 10000);
};

// @desc    Upload a video
// @route   POST /api/videos/upload
// @access  Private (Editor/Admin)
export const uploadVideo = async(req, res) => {
    try{
        if(!req.file){
            return res.status(400).json({ message: "No file uploaded" });
        }

        const video = new Video({
            title: req.body.title || req.file.originalname,
            description: req.body.description,
            filePath: req.file.path,
            fileSize: req.file.size,
            uploadedBy: req.user._id,
            processingStatus: "processing",
            sensitivityStatus: "pending",
        })

        const createdVideo = await video.save();

        simulateProcessing(createdVideo._id, req.io);

        res.status(201).json(createdVideo);
    }catch(err){
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

// @desc    Get all videos
// @route   GET /api/videos
// @access  Private
export const getVideos = async(req, res) => {
    try{
        const videos = await Video.find({}).populate("uploadedBy", "username");
        res.json(videos);
    }catch(err){
        res.status(500).json({ message: "Server error" });
    }
}

// @desc    Get single video
// @route   GET /api/videos/:id
// @access  Private
export const getVideoById = async(req, res) => {
    const video = await Video.findById(req.params.id);

    if(video){
        res.json(video);
    }else{
        res.status(404).json({ message: "Video not found" });
    
    }
}