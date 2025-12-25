import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'viewer'
    });

    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async(e) => {
        e.preventDefault();

        const result = await register(
            formData.username,
            formData.email,
            formData.password,
            formData.role
        );

        if(result.success){
            navigate("/dashboard");
        }else{
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-900">
            
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>
            
            <div className="w-full max-w-md z-10 p-6">
                <div className="glass-panel p-8 rounded-2xl border border-slate-700/50">
                
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2 text-white">Join PulseStream</h1>
                    <p className="text-slate-400">Start streaming securely today.</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-3 rounded-lg mb-6 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Username</label>
                        <input
                            name="username"
                            type="text"
                            onChange={handleChange}
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Email</label>
                        <input
                            name="email"
                            type="email"
                            onChange={handleChange}
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Password</label>
                        <input
                            name="password"
                            type="password"
                            onChange={handleChange}
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">I want to...</label>
                        <select
                            name="role"
                            onChange={handleChange}
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                        >
                            <option value="viewer">Watch Videos (Viewer)</option>
                            <option value="editor">Upload & Edit (Editor)</option>
                            <option value="admin">Manage System (Admin)</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full mt-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold py-3 rounded-lg shadow-lg transform transition hover:-translate-y-0.5"
                    >
                        Create Account
                    </button>
                </form>
                
                <div className="mt-6 text-center text-sm text-slate-400">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold">
                        Sign In
                    </Link>
                </div>

            </div>
        </div>
    </div>
  );

};

export default Register;