// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: "http://163.172.34.204:8081/api",
//   headers: { "Content-Type": "application/json" },
// });

// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("fhims_auth_token");
//     if (token) config.headers.Authorization = `Bearer ${token}`;
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export default axiosInstance;
 
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://163.172.34.204:8081/api",
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Try token from fhims_auth_token
    let token = localStorage.getItem("fhims_auth_token");

    // If not found, try fhims_auth_user
    if (!token) {
      const storedUser = localStorage.getItem("fhims_auth_user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        token = parsed?.token || parsed?.accessToken || parsed?.jwtToken;
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
