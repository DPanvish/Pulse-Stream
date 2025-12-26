import { useState, useRef, useContext, useEffect } from "react";
import { FiUploadCloud, FiX, FiCheck, FiVideo } from "react-icons/fi";
import api from "../api/api";
import AuthContext from "../context/AuthContext";

const UploadModal = ({ isOpen, onClose, onUploadSuccess }) => {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [title, setTitle] = useState("");
    const inputRef = useRef(null);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if(!isOpen){
            setFile(null);
            setUploading(false);
            setTitle("");
        }
    }, [isOpen]);

    if(!isOpen){
        return null;
    }

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if(e.type === "dragenter" || e.type === "gragover"){
            setDragActive(true);
        }else if(e.type === "dragleave"){
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if(e.dataTransfer.files && e.dataTransfer.files[0]){
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if(e.target.files && e.target.files[0]){
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (selectedFile) => {
        if(selectedFile.type.startsWith("video/")){
            setFile(selectedFile);
            setTitle(selectedFile.name.replace(/\.[^/.]+$/, ""));
        }else{
            alert("Please upload a video file!");
        }
    };

    const handleSubmit = async(e) => {
        e.preventDefault();

        if(!file || !title){
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append("video", file);
        formData.append("title", title);

        try{
            await api.post("/videos/upload", formData);

            setUploading(false);
            onUploadSuccess();
            onClose();
        }catch(err){
            console.error(err);
            setUploading(false);
            alert("Upload failed: " + (error.response?.data?.message || err.message));
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="glass-panel w-full max-w-lg rounded-2xl p-6 relative animate-in fade-in zoom-in duration-300">
        
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">Upload Video</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <FiX size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
          
                    {/* Title Input */}
                    <div>
                        <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Video Title</label>
                            <input 
                                type="text" 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Enter a descriptive title"
                                required
                            />
                    </div>

                    {/* Drop Zone */}
                    <div 
                        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                            dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-slate-600 hover:border-slate-500 hover:bg-slate-800/30'
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <input 
                            ref={inputRef}
                            type="file" 
                            className="hidden" 
                            accept="video/*"
                            onChange={handleChange} 
                        />

                        {!file ? (
                            <div className="flex flex-col items-center cursor-pointer" onClick={() => inputRef.current.click()}>
                                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 text-blue-400">
                                    <FiUploadCloud size={32} />
                                </div>
                                <p className="text-white font-medium mb-1">Click to upload or drag and drop</p>
                                <p className="text-sm text-slate-400">MP4, MKV, MOV (Max 100MB)</p>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between bg-slate-800/80 p-4 rounded-lg">
                                <div className="flex items-center space-x-3 truncate">
                                    <FiVideo className="text-blue-400 flex-shrink-0" size={24} />
                                    <span className="text-white truncate max-w-[200px]">{file.name}</span>
                                </div>
                                <button 
                                    type="button"
                                    onClick={() => setFile(null)} 
                                    className="text-red-400 hover:text-red-300 text-sm font-medium"
                                >
                                    Change
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <button
                        type="submit"
                        disabled={!file || uploading}
                        className={`w-full py-3 rounded-lg font-bold shadow-lg flex items-center justify-center space-x-2 transition-all ${
                        !file || uploading 
                        ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white transform hover:-translate-y-0.5'
                        }`}
                    >
                        {uploading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Uploading to Cloud...</span>
                            </>
                        ) : (
                            <>
                                <FiCheck size={20} />
                                <span>Submit Video</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
  );
};

export default UploadModal;