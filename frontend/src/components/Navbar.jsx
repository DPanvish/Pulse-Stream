import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { FiLogOut, FiUploadCloud, FiUser } from "react-icons/fi";

const Navbar = ({ onUploadClick }) => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return(
        <nav className="glass-panel sticky top-0 z-50 px-6 py-4 flex justify-between items-center border-b border-white/10">
            <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-violet-500 rounded-lg animate-pulse"></div>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                    PulseStream
                </span>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-6">

                {/* Upload Button - Only for Editors & Admins */}
                {["editor", "admin"].includes(user?.role) && (
                    <button
                        onClick={onUploadClick}
                        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-all shadow-lg shadow-blue-500/20"
                    >
                        <FiUploadCloud />
                        <span>Upload Video</span>
                    </button>
                )}

                {/* User Profile */}
                <div className="flex items-center space-x-4 border-l border-white/10 pl-6">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-medium text-white">{user?.username}</p>
                        <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                        title="Logout"
                    >
                        <FiLogOut size={20} />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;