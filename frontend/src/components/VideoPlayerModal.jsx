import { useEffect, useRef } from "react";
import { FiX, FiMaximize } from "react-icons/fi";

const VideoPlayerModal = ({ video, onClose }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        const handleEsc = (e) => {
            if(e.key === "Escape"){
                onClose();
            }
        };

        window.addEventListener("keydown", handleEsc);

        return () => {
            window.removeEventListener("keydown", handleEsc);
        };
    }, [onClose]);

    if(!video){
        return null;
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      
            {/* Close Button (Top Right) */}
            <button 
                onClick={onClose}
                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-50 bg-black/20 p-2 rounded-full backdrop-blur-sm"
            >
                <FiX size={32} />
            </button>

            <div className="w-full max-w-5xl mx-4 relative">
                {/* Video Container */}
                <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-white/10 group">
                    <video 
                        ref={videoRef}
                        src={video.filePath} // Cloudinary URL
                        className="w-full h-full object-contain"
                        controls 
                        autoPlay
                        playsInline
                    >
                        Your browser does not support the video tag.
                    </video>
                </div>

                {/* Video Info */}
                <div className="mt-6 text-left">
                    <h2 className="text-2xl font-bold text-white mb-2">{video.title}</h2>
                    <div className="flex items-center space-x-4 text-slate-400 text-sm">
                        <span className="bg-slate-800 px-2 py-1 rounded text-xs text-blue-400 border border-blue-500/20">
                            {video.sensitivityStatus === 'safe' ? 'Safe Content' : 'Flagged Content'}
                        </span>
                        <span>Uploaded by <span className="text-slate-200">{video.uploadedBy?.username}</span></span>
                        <span>•</span>
                        <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayerModal;