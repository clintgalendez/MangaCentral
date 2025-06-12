const API_BASE_URL = 'http://localhost:8002'; // Adjust this to your bookmark service URL

interface MangaBookmark {
  id: string; // Change from number to string to match your UUID
  title: string;
  url: string;
  thumbnail?: string;
  thumbnail_url?: string;
  site_name?: string; // Add this field
  created_at: string;
  updated_at: string; // Add this field
}

interface AddMangaResponse {
  id: string; // Change from number to string
  title: string;
  url: string;
  thumbnail?: string;
  thumbnail_url?: string;
  site_name?: string;
  created_at: string;
  updated_at: string;
}

// Add interface for paginated response
interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const mangaApi = {
  async addManga(url: string): Promise<AddMangaResponse> {
    const userId = localStorage.getItem('user_id');
    const token = localStorage.getItem('token'); // Get token if authentication is needed

    if (!userId) {
      // Handle case where user_id is not found in localStorage
      // This might involve redirecting to login or showing an error
      throw new Error("User ID not found. Please log in again.");
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'X-User-ID': userId, // Add X-User-ID header
    };
    if (token) {
      // Adjust this if your bookmark service uses a different auth scheme (e.g., Bearer token)
      // headers['Authorization'] = `Token ${token}`; 
    }

    try {
      const response = await fetch(`${API_BASE_URL}/bookmarks/`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ url: url }), // Only send URL in the body
      });

      if (!response.ok) {
        let backendMessage = `Failed to add manga. Status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData && errorData.url && Array.isArray(errorData.url) && errorData.url.length > 0) {
            backendMessage = errorData.url[0];
          } else if (errorData && errorData.detail) {
            backendMessage = errorData.detail;
          } else if (errorData && typeof errorData === 'string') {
            backendMessage = errorData;
          } else if (errorData && typeof errorData === 'object' && Object.keys(errorData).length > 0) {
            const messages = Object.values(errorData).flat();
            if (messages.length > 0) {
              backendMessage = messages.join(' ');
            }
          }
        } catch (e) {
          console.error("Could not parse error response JSON:", e);
        }
        throw new Error(backendMessage);
      }
      return await response.json() as AddMangaResponse;
    } catch (err: any) {
      if (err instanceof Error) {
        throw err;
      }
      throw new Error('An unexpected error occurred while adding the manga.');
    }
  },

  async getMangaList(): Promise<PaginatedResponse<MangaBookmark>> {
    const userId = localStorage.getItem('user_id');

    if (!userId) {
      console.error("User ID not found for getMangaList. Returning empty list.");
      return {
        count: 0,
        next: null,
        previous: null,
        results: []
      };
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'X-User-ID': userId,
    };
    const token = localStorage.getItem('token');
    if (token) {
      // headers['Authorization'] = `Token ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}/bookmarks/?user_id=${userId}`, {
      method: 'GET',
      headers: headers,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch manga list');
    }

    return await response.json();
  }
};