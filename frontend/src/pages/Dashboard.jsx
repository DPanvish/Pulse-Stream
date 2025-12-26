import { useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import api from '../api/api';
import Navbar from '../components/Navbar';
import AuthContext from '../context/AuthContext';
import UploadModal from '../components/UploadModal';
import VideoPlayerModal from '../components/VideoPlayerModal';
import { FiPlay, FiClock, FiAlertTriangle, FiCheckCircle, FiLoader, FiVideo, FiTrash2, FiSearch } from 'react-icons/fi';

const SOCKET_URL = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.replace('/api', '') 
  : 'http://localhost:5000';

const socket = io(SOCKET_URL);

const Dashboard = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // New: Search State
  
  const { user } = useContext(AuthContext);

  const fetchVideos = async () => {
    try {
      const { data } = await api.get('/videos');
      setVideos(data);
    } catch (error) {
      console.error("Failed to fetch videos", error);
    } finally {
      setLoading(false);
    }
  };

  // New: Delete Function
  const handleDelete = async (videoId) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await api.delete(`/videos/${videoId}`);
        setVideos(videos.filter(v => v._id !== videoId)); // Remove from UI instantly
      } catch (error) {
        alert('Failed to delete: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  useEffect(() => {
    fetchVideos();
    socket.on('connect', () => console.log('Connected to Socket.io'));
    
    socket.on('video_processed', ({ videoId, status }) => {
      setVideos((prevVideos) => 
        prevVideos.map((vid) => 
          vid._id === videoId 
            ? { ...vid, sensitivityStatus: status, processingStatus: 'completed' } 
            : vid
        )
      );
    });

    return () => {
      socket.off('video_processed');
    };
  }, []);

  // Filter Logic for Search Requirement
  const filteredVideos = videos.filter(video => 
    video.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar onUploadClick={() => setIsModalOpen(true)} />
      
      <UploadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onUploadSuccess={fetchVideos} 
      />

      <VideoPlayerModal 
        video={selectedVideo} 
        onClose={() => setSelectedVideo(null)} 
      />

      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Header with Search Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-3xl font-bold text-white flex items-center self-start md:self-auto">
            <FiVideo className="mr-3 text-blue-500"/> Video Library
          </h2>

          {/* New: Search Input */}
          <div className="relative w-full md:w-64">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search videos..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-full py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center mt-20 text-blue-500 animate-spin">
            <FiLoader size={40} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.length === 0 ? (
                <div className="text-slate-500 col-span-full text-center py-20 bg-slate-800/20 rounded-xl border border-slate-700/50">
                    <p className="text-lg mb-2">No videos found</p>
                    <p className="text-sm">Try adjusting your search or upload a new video.</p>
                </div>
            ) : (
                filteredVideos.map((video) => (
                <div 
                    key={video._id} 
                    className="glass-panel rounded-xl overflow-hidden hover:scale-[1.02] transition-transform duration-300 group relative"
                >
                    {/* Delete Button (Only visible to Owner or Admin) */}
                    {(user?._id === video.uploadedBy?._id || user?.role === 'admin') && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent opening the video player
                          handleDelete(video._id);
                        }}
                        className="absolute top-2 right-2 z-20 bg-black/50 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"
                        title="Delete Video"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    )}

                    {/* Thumbnail Area - Clickable */}
                    <div 
                      onClick={() => setSelectedVideo(video)}
                      className="h-48 bg-slate-800 relative flex items-center justify-center overflow-hidden cursor-pointer"
                    >
                      {video.processingStatus === 'completed' ? (
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all flex items-center justify-center">
                          <button className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-blue-600 hover:scale-110 transition-all shadow-lg">
                              <FiPlay className="ml-1 text-white" size={24} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-slate-500">
                            <FiLoader className="animate-spin mb-2" />
                            <span className="text-xs">Processing...</span>
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg text-white truncate w-3/4">{video.title}</h3>
                        
                        {video.processingStatus === 'processing' && (
                        <span className="flex items-center text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full border border-yellow-500/30">
                            <FiLoader className="animate-spin mr-1" /> Analyzing
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
                ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;