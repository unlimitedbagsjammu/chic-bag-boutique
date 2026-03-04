const isLocal =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

// For a unified Vercel deployment, we use relative paths in production.
// This ensures that the frontend calls the exact same Vercel domain it's hosted on.
const PROD_API_URL = "";

const API_BASE_URL = isLocal ? "http://localhost:5000" : PROD_API_URL;

export default API_BASE_URL;
