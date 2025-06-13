const API_BASE_URL = "http://localhost:8001/api/user";

export interface SignUpRequest {
  username: string;
  email: string;
  password: string;
  password2: string;
  first_name?: string;
  last_name?: string;
}

export interface SignUpResponse {
  user_info: {
    id: number;
    username: string;
    email: string;
  };
  token: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

class AuthenticationService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    console.log('Making request to:', url); // Debug line
    console.log('Request config:', config); // Debug line

    try {
      const response = await fetch(url, config);
      
      console.log('Response status:', response.status); // Debug line
      console.log('Response headers:', response.headers); // Debug line
      
      let data;
      try {
        data = await response.json();
        console.log('Response data:', data); // Debug line
      } catch (jsonError) {
        console.error('Failed to parse JSON:', jsonError);
        throw {
          message: "Invalid response format from server",
        } as ApiError;
      }

      if (!response.ok) {
        throw {
          message: data.error || "Something went wrong",
          errors: data,
        } as ApiError;
      }

      return data;
    } catch (error) {
      console.error('Request error:', error); // Debug line
      if (error instanceof TypeError) {
        // Network error
        throw {
          message: "Network error. Please check your connection.",
        } as ApiError;
      }
      throw error;
    }
  }

  async signUp(userData: SignUpRequest): Promise<SignUpResponse> {
    return this.request<SignUpResponse>("/register/", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: {
    username: string;
    password: string;
  }): Promise<SignUpResponse> {
    return this.request<SignUpResponse>("/login/", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async logout(): Promise<void> {
    const token = localStorage.getItem("token");
    const url = `${API_BASE_URL}/logout/`;

    const config: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        // Try to get error message if there's content
        let errorMessage = "Logout failed";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // Ignore JSON parsing error for logout
        }
        throw {
          message: errorMessage,
        } as ApiError;
      }

      // Don't try to parse JSON for successful logout
      return;
    } catch (error) {
      if (error instanceof TypeError) {
        throw {
          message: "Network error. Please check your connection.",
        } as ApiError;
      }
      throw error;
    }
  }
}

export const authenticationService = new AuthenticationService();
