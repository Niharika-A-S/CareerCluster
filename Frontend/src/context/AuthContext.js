import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI, userAPI } from '../services/api';

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  interests: [],
  bookings: [],
  messages: [],
  loading: false,
  error: null
};

// Action types
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  UPDATE_INTERESTS: 'UPDATE_INTERESTS',
  ADD_BOOKING: 'ADD_BOOKING',
  CANCEL_BOOKING: 'CANCEL_BOOKING',
  ADD_MESSAGE: 'ADD_MESSAGE',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    
    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        interests: [],
        bookings: [],
        messages: [],
        error: null
      };
    
    case AUTH_ACTIONS.REGISTER_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    
    case AUTH_ACTIONS.UPDATE_INTERESTS:
      return {
        ...state,
        interests: action.payload
      };
    
    case AUTH_ACTIONS.ADD_BOOKING:
      return {
        ...state,
        bookings: [...state.bookings, action.payload]
      };
    
    case AUTH_ACTIONS.CANCEL_BOOKING:
      return {
        ...state,
        bookings: state.bookings.filter(booking => booking.id !== action.payload)
      };
    
    case AUTH_ACTIONS.ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload]
      };
    
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedInterests = localStorage.getItem('userInterests');
    const savedBookings = localStorage.getItem('userBookings');
    const savedMessages = localStorage.getItem('userMessages');
    const token = localStorage.getItem('authToken');

    if (savedUser) {
      const user = JSON.parse(savedUser);
      dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: { user } });
    }

    if (savedInterests) {
      const interests = JSON.parse(savedInterests);
      dispatch({ type: AUTH_ACTIONS.UPDATE_INTERESTS, payload: interests });
    }

    if (savedBookings) {
      const bookings = JSON.parse(savedBookings);
      bookings.forEach(booking => {
        dispatch({ type: AUTH_ACTIONS.ADD_BOOKING, payload: booking });
      });
    }

    if (savedMessages) {
      const messages = JSON.parse(savedMessages);
      messages.forEach(message => {
        dispatch({ type: AUTH_ACTIONS.ADD_MESSAGE, payload: message });
      });
    }

    // If we have a token, prefer server as source of truth.
    // This keeps profile/interests persistent across logouts/logins and devices.
    (async () => {
      if (!token) return;
      try {
        const [profileRes, interestsRes] = await Promise.all([userAPI.getProfile(), userAPI.getInterests()]);
        const user = profileRes.data?.data?.user;
        const interests = interestsRes.data?.data?.interests;
        if (user) dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: { user } });
        if (Array.isArray(interests)) dispatch({ type: AUTH_ACTIONS.UPDATE_INTERESTS, payload: interests });
      } catch (e) {
        // If token is invalid, interceptor will redirect to /login and clear storage.
      }
    })();
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (state.user) {
      localStorage.setItem('user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('user');
    }
  }, [state.user]);

  useEffect(() => {
    localStorage.setItem('userInterests', JSON.stringify(state.interests));
  }, [state.interests]);

  useEffect(() => {
    localStorage.setItem('userBookings', JSON.stringify(state.bookings));
  }, [state.bookings]);

  useEffect(() => {
    localStorage.setItem('userMessages', JSON.stringify(state.messages));
  }, [state.messages]);

  // Action creators
  const login = async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    
    try {
      const response = await authAPI.login(credentials);
      
      const { user } = response.data.data;
      const { token } = response.data;
      
      localStorage.setItem('authToken', token);
      
      dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: { user } });
      return true;
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE, payload: error.response?.data?.message || 'Login failed. Please try again.' });
      return false;
    }
  };

  const register = async (userData) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    
    try {
      const payload = {
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        password: userData.password,
        role: userData.role === 'student' ? 'mentee' : userData.role
      };
      
      const response = await authAPI.signup(payload);
      
      const { user } = response.data.data;
      const { token } = response.data;
      
      localStorage.setItem('authToken', token);
      
      dispatch({ type: AUTH_ACTIONS.REGISTER_SUCCESS, payload: { user } });
      return true;
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE, payload: error.response?.data?.message || 'Registration failed. Please try again.' });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  const updateInterests = async (nextInterests) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    try {
      await userAPI.updateInterests(nextInterests);
      dispatch({ type: AUTH_ACTIONS.UPDATE_INTERESTS, payload: nextInterests });
      return true;
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: error.response?.data?.message || 'Failed to update interests.',
      });
      return false;
    }
  };

  const addBooking = (booking) => {
    const newBooking = {
      ...booking,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    dispatch({ type: AUTH_ACTIONS.ADD_BOOKING, payload: newBooking });
  };

  const cancelBooking = (bookingId) => {
    dispatch({ type: AUTH_ACTIONS.CANCEL_BOOKING, payload: bookingId });
  };

  const addMessage = (message) => {
    const newMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    dispatch({ type: AUTH_ACTIONS.ADD_MESSAGE, payload: newMessage });
  };

  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateInterests,
    addBooking,
    cancelBooking,
    addMessage,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;