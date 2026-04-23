import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('authToken') || ''}`
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/auth/signup', userData),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh'),
};

// User API calls
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (userData) => api.put('/user/profile', userData),
  getInterests: () => api.get('/user/interests'),
  updateInterests: (interests) => api.put('/user/interests', { interests }),
  deleteAccount: () => api.delete('/user/account'),
};

// Mentor API calls
export const mentorAPI = {
  getAllMentors: (params) => api.get('/mentors', { params }),
  getMentorById: (id) => api.get(`/mentors/${id}`),
  searchMentors: (searchParams) => api.get('/mentors/search', { params: searchParams }),
  getMentorAvailability: (id) => api.get(`/mentors/${id}/availability`),
};

// Booking API calls
export const bookingAPI = {
  createBooking: (bookingData) => api.post('/bookings', bookingData),
  getBookings: () => api.get('/bookings'),
  getBookingById: (id) => api.get(`/bookings/${id}`),
  updateBooking: (id, bookingData) => api.put(`/bookings/${id}`, bookingData),
  cancelBooking: (id) => api.delete(`/bookings/${id}`),
};

// Review API calls
export const reviewAPI = {
  createReview: (reviewData) => api.post('/reviews', reviewData),
  getMentorReviews: (mentorId) => api.get(`/reviews/mentor/${mentorId}`),
  updateReview: (id, reviewData) => api.put(`/reviews/${id}`, reviewData),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
};

// Notification API calls
export const notificationAPI = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
};

// Group API calls
export const groupAPI = {
  createGroup: (groupData) => api.post('/groups', groupData),
  getMyGroups: (params) => api.get('/groups/my-groups', { params }),
  getDiscoverableGroups: (params) => api.get('/groups/discover', { params }),
  getGroupById: (id) => api.get(`/groups/${id}`),
  joinGroup: (id) => api.post(`/groups/${id}/join`),
  leaveGroup: (id) => api.post(`/groups/${id}/leave`),
  addStudentToGroup: (groupId, studentId) => api.post(`/groups/${groupId}/add-student`, { studentId }),
};

// Task API calls
export const taskAPI = {
  createTask: (taskData) => api.post('/tasks', taskData),
  getTasks: (params) => api.get('/tasks', { params }),
  getTaskById: (id) => api.get(`/tasks/${id}`),
  updateTask: (id, taskData) => api.put(`/tasks/${id}`, taskData),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
};

// Export the default api instance for custom calls
export default api;