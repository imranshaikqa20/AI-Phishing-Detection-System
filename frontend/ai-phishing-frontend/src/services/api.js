import axios from "axios";

// =========================
// CREATE AXIOS INSTANCE
// =========================

const api = axios.create({

  // =========================
  // BACKEND BASE URL
  // =========================

  baseURL:
    "http://localhost:8080/api",

  // =========================
  // REQUEST TIMEOUT
  // =========================

  timeout: 10000,

  // =========================
  // DEFAULT HEADERS
  // =========================

  headers: {

    "Content-Type":
      "application/json",
  },
});

// =========================
// REQUEST INTERCEPTOR
// AUTO ATTACH JWT TOKEN
// =========================

api.interceptors.request.use(

  (config) => {

    // =========================
    // CHECK BROWSER
    // =========================

    if (
      typeof window !==
      "undefined"
    ) {

      // =========================
      // GET JWT TOKEN
      // =========================

      const token =

        localStorage.getItem(
          "token"
        );

      // =========================
      // ADD AUTHORIZATION HEADER
      // =========================

      if (token) {

        config.headers.Authorization =

          `Bearer ${token}`;
      }
    }

    return config;
  },

  (error) => {

    return Promise.reject(
      error
    );
  }
);

// =========================
// RESPONSE INTERCEPTOR
// HANDLE JWT + API ERRORS
// =========================

api.interceptors.response.use(

  // =========================
  // SUCCESS RESPONSE
  // =========================

  (response) => {

    return response;
  },

  // =========================
  // ERROR RESPONSE
  // =========================

  (error) => {

    // =========================
    // RESPONSE STATUS
    // =========================

    const status =
      error.response?.status;

    // =========================
    // UNAUTHORIZED
    // INVALID / EXPIRED TOKEN
    // =========================

    if (status === 401) {

      console.log(
        "Unauthorized Access"
      );

      // =========================
      // CLEAR STORED DATA
      // =========================

      if (
        typeof window !==
        "undefined"
      ) {

        localStorage.removeItem(
          "token"
        );

        localStorage.removeItem(
          "role"
        );

        localStorage.removeItem(
          "name"
        );

        localStorage.removeItem(
          "email"
        );

        localStorage.removeItem(
          "loginCount"
        );

        localStorage.removeItem(
          "lastLoginAt"
        );
      }

      // =========================
      // REDIRECT TO LOGIN
      // =========================

      window.location.href =
        "/auth/login";
    }

    // =========================
    // ACCESS FORBIDDEN
    // =========================

    if (status === 403) {

      console.log(
        "Access Forbidden"
      );

      alert(
        "You are not authorized to access this resource."
      );
    }

    // =========================
    // SERVER ERROR
    // =========================

    if (status === 500) {

      console.log(
        "Internal Server Error"
      );

      alert(
        "Server Error Occurred"
      );
    }

    // =========================
    // NETWORK ERROR
    // =========================

    if (
      error.code ===
      "ERR_NETWORK"
    ) {

      console.log(
        "Backend Server Not Running"
      );

      alert(
        "Cannot connect to backend server."
      );
    }

    // =========================
    // REQUEST TIMEOUT
    // =========================

    if (
      error.code ===
      "ECONNABORTED"
    ) {

      console.log(
        "Request Timeout"
      );

      alert(
        "Request Timeout. Try Again."
      );
    }

    // =========================
    // RETURN ERROR
    // =========================

    return Promise.reject(
      error
    );
  }
);

// =========================
// HELPER METHODS
// =========================

// =========================
// SAVE USER SESSION
// =========================

export const saveUserSession = (

  data

) => {

  localStorage.setItem(
    "token",
    data.token
  );

  localStorage.setItem(
    "role",
    data.role
  );

  localStorage.setItem(
    "name",
    data.name
  );

  localStorage.setItem(
    "email",
    data.email
  );

  localStorage.setItem(
    "loginCount",
    data.loginCount
  );

  localStorage.setItem(
    "lastLoginAt",
    data.lastLoginAt
  );
};

// =========================
// CLEAR USER SESSION
// =========================

export const clearUserSession = () => {

  localStorage.removeItem(
    "token"
  );

  localStorage.removeItem(
    "role"
  );

  localStorage.removeItem(
    "name"
  );

  localStorage.removeItem(
    "email"
  );

  localStorage.removeItem(
    "loginCount"
  );

  localStorage.removeItem(
    "lastLoginAt"
  );
};

// =========================
// CHECK AUTHENTICATION
// =========================

export const isAuthenticated = () => {

  if (
    typeof window ===
    "undefined"
  ) {

    return false;
  }

  return !!localStorage.getItem(
    "token"
  );
};

// =========================
// CHECK ADMIN ROLE
// =========================

export const isAdmin = () => {

  if (
    typeof window ===
    "undefined"
  ) {

    return false;
  }

  return (

    localStorage.getItem(
      "role"
    ) === "ROLE_ADMIN"
  );
};

// =========================
// GET TOKEN
// =========================

export const getToken = () => {

  return localStorage.getItem(
    "token"
  );
};

// =========================
// EXPORT AXIOS INSTANCE
// =========================

export default api;