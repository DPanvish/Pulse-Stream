import { createContext, useState, useEffect } from "react";
import api from "../api/api";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userInfo = localStorage.getItem("userInfo");

        if(userInfo){
            setUser(JSON.parse(userInfo));
        }

        setLoading(false);
    }, []);
    
    // Login
    const login = async(email, password) => {
        try{
            const {data} = await api.post("/users/login", {email, password});
            localStorage.setItem("userInfo", JSON.stringify(data));
            setUser(data);
            return {success: true};
        }catch(err){
            return {success: false, message: err.response?.data?.message || "Login failed"}; 
        }
    };

    // Register
    const register = async(username, email, password, role) => {
        try{
            const {data} = await api.post("/users", {username, email, password, role});
            localStorage.setItem("userInfo", JSON.stringify(data));
            setUser(data);
            return {success: true};
        }catch(err){
            return {success: false, message: err.response?.data?.message || "Registration failed"}; 
        }
    };

    // Logout
    const logout = () => {
        localStorage.removeItem("userInfo");
        setUser(null);
    };

    return(
        <AuthContext.Provider value={{user, loading, login, register, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;