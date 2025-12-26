import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use(
  (config) => {
    const userInfoString = localStorage.getItem('userInfo');
    
    if (userInfoString) {
      const userInfo = JSON.parse(userInfoString);
      
      if (userInfo && userInfo.token) {
        config.headers.Authorization = `Bearer ${userInfo.token}`;
      } else {
        console.warn("⚠️ userInfo found, but NO TOKEN inside! User needs to re-login.");
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;