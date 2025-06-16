const API_BASE_URL = import.meta.env.VITE_BOOKMARK_API_BASE_URL

interface MangaBookmark {
  id: string; 
  title: string;
  url: string;
  thumbnail?: string;
  thumbnail_url?: string;
  site_name?: string;
  created_at: string;
  updated_at: string;
}

interface AddMangaResponse {
  id: string;
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

interface SupportedSite {
  name: string;
  domain: string;
  is_active: boolean;
  description?: string;
}

export const mangaApi = {
  async addManga(url: string): Promise<AddMangaResponse | { detail: string; task_id: string }> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error("Authentication token not found. Please log in again.");

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,
    };

    const response = await fetch(`${API_BASE_URL}/bookmarks/`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ url }),
    });

    // If 202 Accepted, return task_id for polling
    if (response.status === 202) {
      return await response.json();
    }

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
  },

  async getTaskStatus(taskId: string): Promise<{ status: string }> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error("Authentication token not found. Please log in again.");

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,
    };

    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/status/`, {
      method: 'GET',
      headers,
    });
    if (!response.ok) throw new Error("Failed to check task status");
    return await response.json();
  },

  async getMangaList(): Promise<PaginatedResponse<MangaBookmark>> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error("Authentication token not found for getMangaList. Returning empty list.");
      return {
        count: 0,
        next: null,
        previous: null,
        results: []
      };
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,
    };
    
    const response = await fetch(`${API_BASE_URL}/bookmarks/`, {
      method: 'GET',
      headers: headers,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch manga list');
    }

    return await response.json();
  },

  async deleteManga(id: string): Promise<void> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error("Authentication token not found. Please log in again.");

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,
    };

    const response = await fetch(`${API_BASE_URL}/bookmarks/${id}/`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      let backendMessage = `Failed to delete manga. Status: ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData && errorData.detail) backendMessage = errorData.detail;
      } catch {}
      throw new Error(backendMessage);
    }
  },

  async getSupportedSites(): Promise<SupportedSite[]> {
    const response = await fetch(`${API_BASE_URL}/supported-sites/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch supported sites");
    }
    return await response.json();
  },

  async refreshManga(bookmarkId: string): Promise<{ detail: string; task_id: string }> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error("Authentication token not found. Please log in again.");

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,
    };

    const response = await fetch(`${API_BASE_URL}/bookmarks/${bookmarkId}/refresh/`, {
      method: 'POST',
      headers: headers,
    });

    if (!response.ok) {
      let backendMessage = `Failed to refresh manga. Status: ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData && errorData.detail) backendMessage = errorData.detail;
      } catch {}
      throw new Error(backendMessage);
    }
    return await response.json();
  }
};