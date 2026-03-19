// Import the shared axios instance and token helper from your project's api.js
// This way all admin API calls use the same base URL (http://localhost:5000/api)
import { API, getAdminToken } from "../../../services/api";

// Returns axios config object with admin Authorization header
// Usage: await adminAPI.get("/admin/complaints", adminAuth())
export function adminAuth() {
  return {
    headers: {
      Authorization: `Bearer ${getAdminToken()}`,
    },
  };
}

// The axios instance — use this instead of raw fetch in all admin components
export default API;