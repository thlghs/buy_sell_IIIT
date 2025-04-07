import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:5000/api", // Update the baseURL as per your backend server
    withCredentials: true,         
});

export default axiosInstance;
