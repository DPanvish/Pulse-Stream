import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api",
})

// Interceptor: Automatically add the Token to headers if it exists
api.interceptors.request.use((config) => {
    const user = localStorage.getItem("userInfo");

    if(user){
        const {token} = JSON.parse(user);
        config.headers.Authorization = `Bearer ${user.token}`;
    }

    return config;
},
    (error) => {
        Promise.reject(error);
    }
);

export default api;
