const isLocal =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

const PROD_API_URL = "https://api.bagsunlimited.in"; // change if backend URL differs

const API_BASE_URL = isLocal ? "http://localhost:5000" : PROD_API_URL;

export default API_BASE_URL;
