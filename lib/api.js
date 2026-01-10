const API_BASE = 'http://localhost:8081/api';

export async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

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

export async function getAvailableRooms() {
  return fetchAPI('/rooms/available', { method: 'GET' });
}

export async function getAvailableRoomsByType(type) {
  return fetchAPI(`/rooms/available/${type}`, { method: 'GET' });
}

// Add this to lib/api.js

export async function createRoomBooking(userId, roomId, checkInDate, checkOutDate) {
  return fetchAPI('/bookings/room/create', {
    method: 'POST',
    body: JSON.stringify({
      userId,
      roomId,
      checkInDate,
      checkOutDate,
    }),
  });
}

export async function validateCoupon(couponCode) {
  return fetchAPI(`/coupons/validate/${couponCode}`, {
    method: 'GET',
  });
}

export async function useCoupon(couponCode) {
  return fetchAPI(`/coupons/use/${couponCode}`, {
    method: 'POST',
  });
}