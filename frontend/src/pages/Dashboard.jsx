import { useState, useEffect, useContext } from "react";
import { io } from "socket.io-client";
import api from "../api/api";
import Navbar from "../components/Navbar";
import AuthContext from "../context/AuthContext";
import UploadModal from "../components/UploadModal";
import VideoPlayerModal from "../components/VideoPlayerModal";
import { FiPlay, FiClock, FiAlertTriangle, FiCheckCircle, FiLoader } from "react-icons/fi";

const socket = io("http://localhost:5000");

const Dashboard = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const { user } = useContext(AuthContext);

    const fetchVideos = async() => {
        try{
            const {data} = await api.get("/videos");
            setVideos(data);
        }catch(err){
            console.error("Failed to fetch videos");
        }finally{
            setLoading(false);
        }
    };

    useEffect(() => {

        fetchVideos();

        // Real-Time Listener
        socket.on("connect", () => console.log("Connected to Socket.io"));

        socket.on("video_processed", ({videoId, status}) => {
            setVideos((prevVideos) =>
                prevVideos.map((video) =>
                    video._id === videoId ? { ...video, sensitivityStatus: status, processingStatus: "completed"} : video
                )
            );
        });

        return () => {
            socket.off("video_processed");
        };
    }, []);


    return (
        <div className="min-h-screen bg-slate-900">
            <Navbar onUploadClick={() => setIsModalOpen(true)} />

                {/* The Upload Modal */}
                <UploadModal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    onUploadSuccess={fetchVideos} // Refresh list after upload
                />

                {/* Video Player Modal */}
                <VideoPlayerModal 
                    video={selectedVideo} 
                    onClose={() => setSelectedVideo(null)} 
                />

                <main className="max-w-7xl mx-auto px-6 py-8">
                    <h2 className="text-3xl font-bold mb-8 text-white">Video Library</h2>

                        {loading ? (
                            <div className="flex justify-center mt-20 text-blue-500 animate-spin">
                                <FiLoader size={40} />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {videos.map((video) => (
                                    <div 
                                        key={video._id} 
                                        className="glass-panel rounded-xl overflow-hidden hover:scale-[1.02] transition-transform duration-300 group"
                                    >
                                        
                                        {/* Thumbnail / Video Placeholder */}
                                        <div className="h-48 bg-slate-800 relative flex items-center justify-center overflow-hidden">
                                
                                            {/* If processed, show Play button */}
                                            {video.processingStatus === 'completed' ? (
                                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all flex items-center justify-center">
                                                    <button className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                                                        <FiPlay className="ml-1 text-white" size={24} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center text-slate-500">
                                                    <FiLoader className="animate-spin mb-2" />
                                                    <span className="text-xs">Processing Preview...</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Video Info */}
                                        <div className="p-5">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-semibold text-lg text-white truncate w-3/4">{video.title}</h3>
                                    
                                                {/* Status Badges */}
                                                {video.processingStatus === 'processing' && (
                                                    <span className="flex items-center text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full border border-yellow-500/30">
                                                        <FiLoader className="animate-spin mr-1" /> Processing
                                                    </span>
                                                )}

                                                {video.sensitivityStatus === 'safe' && (
                                                    <span className="flex items-center text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full border border-green-500/30">
                                                        <FiCheckCircle className="mr-1" /> Safe
                                                    </span>
                                                )}

                                                {video.sensitivityStatus === 'flagged' && (
                                                    <span className="flex items-center text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded-full border border-red-500/30">
                                                        <FiAlertTriangle className="mr-1" /> Flagged
                                                    </span>
                                                )}
                                            </div>
                                
                                            <div className="flex justify-between text-slate-400 text-xs mt-4">
                                                <span>By {video.uploadedBy?.username || 'Unknown'}</span>
                                                <span className="flex items-center"><FiClock className="mr-1"/> {new Date(video.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                </main>
        </div>
    );
};

export default Dashboard;