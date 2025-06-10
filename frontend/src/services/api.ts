const API_BASE_URL = 'http://localhost:8001/api/user';

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

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw {
          message: data.error || 'Something went wrong',
          errors: data,
        } as ApiError;
      }

      return data;
    } catch (error) {
      if (error instanceof TypeError) {
        // Network error
        throw {
          message: 'Network error. Please check your connection.',
        } as ApiError;
      }
      throw error;
    }
  }

  async signUp(userData: SignUpRequest): Promise<SignUpResponse> {
    return this.request<SignUpResponse>('/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: { username: string; password: string }): Promise<SignUpResponse> {
    return this.request<SignUpResponse>('/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout(): Promise<void> {
    const token = localStorage.getItem('token');
    return this.request<void>('/logout/', {
      method: 'POST',
      headers: {
        Authorization: `Token ${token}`,
      },
    });
  }
}

export const apiService = new ApiService();