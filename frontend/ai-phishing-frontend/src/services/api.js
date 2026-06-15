import axios from "axios";

// API BASE URL
const API_BASE_URL =
process.env.NEXT_PUBLIC_API_URL ||
"https://ai-phishing-backend-qrdn.onrender.com/api";

// API INSTANCE
const api = axios.create({
baseURL: API_BASE_URL,
timeout: 15000,
headers: {
"Content-Type": "application/json",
},
});

// SAFE LOCAL STORAGE HELPERS
const isBrowser = () => typeof window !== "undefined";

const getStorageItem = (key) => {
if (!isBrowser()) return null;
return localStorage.getItem(key);
};

const setStorageItem = (key, value) => {
if (!isBrowser()) return;
localStorage.setItem(key, value);
};

const removeStorageItem = (key) => {
if (!isBrowser()) return;
localStorage.removeItem(key);
};

// REQUEST INTERCEPTOR
api.interceptors.request.use(
(config) => {
const token = getStorageItem("token");

```
if (token) {
  config.headers.Authorization = `Bearer ${token}`;
}

return config;
```

},
(error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
(response) => response,
(error) => {
const status = error.response?.status;

```
// 401 - Unauthorized
if (status === 401) {
  console.log("Unauthorized - clearing session");

  clearUserSession();

  if (isBrowser()) {
    window.location.href = "/auth/login";
  }
}

// 403 - Forbidden
if (status === 403) {
  alert("Access Forbidden");
}

// 429 - Rate Limit
if (status === 429) {
  alert(
    error.response?.data?.message ||
      "Daily Limit Reached"
  );
}

// 500 - Internal Server Error
if (status === 500) {
  alert(
    error.response?.data?.message ||
      "Internal Server Error"
  );
}

// Network Error
if (error.code === "ERR_NETWORK") {
  alert(
    "Unable to connect to server. Please try again later."
  );
}

return Promise.reject(error);
```

}
);

// AUTH APIs
export const loginUser = (loginData) =>
api.post("/auth/login", loginData);

export const registerUser = (registerData) =>
api.post("/auth/register", registerData);

// SCAN APIs
export const analyzeContent = (data) =>
api.post("/scan/analyze", data);

export const uploadAndScanFile = (formData) =>
api.post("/scan/upload", formData, {
headers: {
"Content-Type": "multipart/form-data",
},
});

export const getScanHistory = () =>
api.get("/scan/history");

export const getDashboardMetrics = () =>
api.get("/scan/metrics");

// SAVE USER SESSION
export const saveUserSession = (data) => {
console.log("LOGIN RESPONSE:", data);

if (data.token) {
setStorageItem("token", data.token);
}

const resolvedUserId =
data.userId ?? data.id ?? null;

if (
resolvedUserId !== null &&
resolvedUserId !== undefined
) {
setStorageItem(
"userId",
String(resolvedUserId)
);
}

if (data.name) {
setStorageItem("name", data.name);
}

if (data.email) {
setStorageItem("email", data.email);
}

if (data.role) {
setStorageItem("role", data.role);
}

if (
data.loginCount !== undefined &&
data.loginCount !== null
) {
setStorageItem(
"loginCount",
String(data.loginCount)
);
}

if (data.lastLoginAt) {
setStorageItem(
"lastLoginAt",
data.lastLoginAt
);
}
};

// CLEAR SESSION
export const clearUserSession = () => {
removeStorageItem("token");
removeStorageItem("userId");
removeStorageItem("name");
removeStorageItem("email");
removeStorageItem("role");
removeStorageItem("loginCount");
removeStorageItem("lastLoginAt");
};

// AUTH CHECKS
export const isAuthenticated = () =>
!!getStorageItem("token");

export const isAdmin = () =>
getStorageItem("role") === "ROLE_ADMIN";

// GETTERS
export const getToken = () =>
getStorageItem("token");

export const getUserId = () =>
getStorageItem("userId");

// EXPORT DEFAULT
export default api;
