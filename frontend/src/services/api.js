import axios from "axios";

// One place to change backend URL (also supports .env: REACT_APP_API_BASE_URL)
export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

export const API = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

export const getCitizenToken = () => localStorage.getItem("token");
export const getStaffToken = () => localStorage.getItem("authorityToken");
export const getAdminToken = () => localStorage.getItem("adminToken");

export const authHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const multipartAuthHeader = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data",
  },
});

// Builds a URL for uploaded files like images/certificates.
export const fileUrl = (path) => `${API_BASE_URL}/${path}`;

export const fetchIssues = () => API.get("/issues");
