import axios from "axios";

// Create a new instance of Axios
const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

// Add a request interceptor to modify requests before they are sent
api.interceptors.request.use(
  (config) => {
    // Retrieve the latest token value from the localStorage
    const token = localStorage.getItem("token");
    if (token) {
      // Set the token in the request header
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Do something with the request error, like logging it
    return Promise.reject(error);
  }
);

// Add a response interceptor to add CORS headers
api.interceptors.response.use(
  (response) => {
    // Add CORS headers
    response.headers["Access-Control-Allow-Origin"] = "*";
    response.headers["Access-Control-Allow-Methods"] =
      "GET, POST, PUT, DELETE, OPTIONS";
    response.headers["Access-Control-Allow-Headers"] =
      "Content-Type, Authorization";
    return response;
  },
  (error) => {
    // Do something with the response error, like logging it
    return Promise.reject(error);
  }
);

// Define a function to handle errors
const handleError = (error) => {
  console.error(error);
  throw error;
};

// Define a function to get data from the API
export const getData = async (url) => {
  try {
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Define a function to create data in the API
export const createData = async (url, data) => {
  try {
    const response = await api.post(url, data, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Define a function to update data in the API
export const updateData = async (url, data) => {
  try {
    const response = await api.put(url, data, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Define a function to delete data from the API
export const deleteData = async (url) => {
  try {
    const response = await api.delete(url, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export default api;
