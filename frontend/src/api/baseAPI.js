import axios from "axios";
import { USE_MOCK_API } from "../config/apiConfig";
import { createMockAxiosInstance } from "../mocks/mockApi";

// Get API URL from environment variable or use default
const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    // Ensure URL ends with / and add 'api' path
    const baseUrl = envUrl.endsWith("/") ? envUrl : `${envUrl}/`;
    return `${baseUrl}api`;
  }
  // Default fallback URL
  return "http://localhost:5000/api";
};

// Use mock axios instance if mock mode is enabled
const axiosInstance = USE_MOCK_API
  ? createMockAxiosInstance()
  : axios.create({
      baseURL: getApiUrl(),
    });

export default axiosInstance;
