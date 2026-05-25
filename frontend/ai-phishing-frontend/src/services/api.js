import axios from "axios";

// Create Axios Instance

const api = axios.create({

    // Backend Base URL
    baseURL: "http://localhost:8080/api",

    // Request Timeout
    timeout: 10000,

    // Default Headers
    headers: {
        "Content-Type": "application/json",
    },
});

// Automatically Attach Token

api.interceptors.request.use(

    (config) => {

        // Get Token from Local Storage
        const token = localStorage.getItem("token");

        // Add Token to Headers
        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor

api.interceptors.response.use(

    (response) => {
        return response;
    },

    (error) => {

        // Handle Unauthorized
        if (error.response?.status === 401) {

            console.log("Unauthorized Access");
        }

        // Handle Server Errors
        if (error.response?.status === 500) {

            console.log("Server Error");
        }

        return Promise.reject(error);
    }
);

export default api;