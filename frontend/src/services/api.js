import axios from 'axios';

const API_BASE_URL = '/api/v1';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await axios.post(
          '/api/v1/auth/refresh',
          {},
          { withCredentials: true }
        );

        const newToken = data.accessToken;

        // store new token
        localStorage.setItem("accessToken", newToken);

        // update axios default header
        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

        // update current request header
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

        return api(originalRequest);

      } catch (err) {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
    signup: (data) => api.post('/auth/signup', data),
    login: (data) => api.post('/auth/login', data),
    refresh: () => api.post('/auth/refresh'),
};

// Hotel Browse APIs
export const hotelBrowseAPI = {
    search: (params) => api.get('/hotels/search', { params }),
    getHotelInfo: (hotelId) => api.get(`/hotels/${hotelId}/info`),
};

// Admin Hotel APIs
export const hotelAdminAPI = {
    create: (data) => api.post('/admin/hotels', data),
    getAll: () => api.get('/admin/hotels'),
    getById: (hotelId) => api.get(`/admin/hotels/${hotelId}`),
    update: (hotelId, data) => api.put('/admin/hotels', data),
    delete: (hotelId) => api.delete(`/admin/hotels/${hotelId}`),
    activate: (hotelId) => api.patch(`/admin/hotels/${hotelId}`),
    getBookings: (hotelId) => api.get(`/admin/hotels/${hotelId}/bookings`),
};

// Room Admin APIs
export const roomAdminAPI = {
    create: (hotelId, data) => api.post(`/admin/hotels/${hotelId}/rooms`, data),
    getAll: (hotelId) => api.get(`/admin/hotels/${hotelId}/rooms`),
    getById: (roomId) => api.get(`/admin/hotels/0/rooms/${roomId}`),
    delete: (roomId) => api.delete(`/admin/hotels/0/rooms/${roomId}`),
};

// Booking APIs
export const bookingAPI = {
    init: (data) => api.post('/bookings/init', data),
    addGuests: (bookingId, guests) => api.post(`/bookings/${bookingId}/addGuests`, guests),
    initiatePayment: (bookingId) => api.post(`/bookings/${bookingId}/payments`),
    cancel: (bookingId) => api.post(`/bookings/${bookingId}/cancel`),
};

export default api;
