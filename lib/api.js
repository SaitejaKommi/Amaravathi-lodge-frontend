const API_BASE = 'http://localhost:8081/api';

export async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add auth token if available
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

// User APIs
export async function registerUser(email, phone, name) {
  return fetchAPI('/users/register', {
    method: 'POST',
    body: JSON.stringify({ email, phone, name }),
  });
}

// Room APIs
export async function getAllRooms() {
  return fetchAPI('/rooms', { method: 'GET' });
}

export async function getRoomById(id) {
  return fetchAPI(`/rooms/${id}`, { method: 'GET' });
}

export async function getRoomsByType(type) {
  return fetchAPI(`/rooms/type/${type}`, { method: 'GET' });
}

// Add more API functions as needed