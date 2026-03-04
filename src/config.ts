
// In a unified Vercel deployment, we use relative paths (/api) in production
// In development, we fallback to the local backend server (localhost:5000)
const API_BASE_URL = import.meta.env.PROD
    ? window.location.origin
    : (import.meta.env.VITE_API_URL || 'http://localhost:5000');

export default API_BASE_URL;
