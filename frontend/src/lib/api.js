const API_BASE_URL = "http://localhost:8001"; // User service port

class ApiError extends Error {
  constructor(message, status, errors) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

export const api = {
  async post(endpoint, data) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.detail || `HTTP error! status: ${response.status}`,
        response.status,
        errorData
      );
    }
    return response.json();
  },
};

export const userService = {
  async login(credentials) {
    try {
      return await api.post("/api/user/login/", credentials);
    } catch (error) {
      console.error("Login failed:", error);
      // Propagate the error object which might contain response details
      if (error.response && error.response.data) {
        throw { ...error.response.data, status: error.response.status };
      }
      throw error;
    }
  },

  async register(userData) {
    try {
      return await api.post("/api/user/register/", userData);
    } catch (error) {
      console.error("Registration failed:", error);
      if (error.response && error.response.data) {
        throw { ...error.response.data, status: error.response.status };
      }
      throw error;
    }
  },

  async logout() {
    const token = localStorage.getItem("authToken");
    if (!token) {
      // No token, so client is effectively logged out.
      console.warn(
        "No auth token found locally for logout. Proceeding with client-side cleanup."
      );
      return Promise.resolve({ message: "Already logged out locally." });
    }
    try {
      // which relies on the token being present in the Authorization header.
      return await api.post(
        "/api/user/logout/",
        {},
        {
          // Empty data object for POST
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("API Logout failed:", error);
      // Propagate the error; it will be handled by the calling function.
      // If error.response exists, it contains details from the server.
      if (error.response && error.response.data) {
        throw {
          ...error.response.data,
          status: error.response.status,
          message: error.message,
        };
      }
      throw error;
    }
  },
};
