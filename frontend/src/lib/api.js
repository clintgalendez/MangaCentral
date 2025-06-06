const API_BASE_URL = "http://localhost:8001"; // User service port

class ApiError extends Error {
  constructor(message, status, errors = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

export const api = {
  async post(endpoint, data) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new ApiError("Request failed", response.status, responseData);
      }

      return responseData;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      // Network or other errors
      throw new ApiError("Network error. Please check your connection.", 0, {});
    }
  },
};

export const userService = {
  async register(userData) {
    return api.post("/api/user/register/", userData);
  },
};
