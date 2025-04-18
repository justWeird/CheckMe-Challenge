
import axios from "axios";

const API_URL = "http://localhost:5050";

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to add the token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  getUserProfile: () => api.get("/auth/user"),
  logout: () => api.get("/auth/logout"),
  updateUserRole: (role: string) => api.put("/auth/role", { role }),
};

// User Services
export const userService = {
  getDoctors: () => api.get("/users/doctors"),
  getProfile: () => api.get("/users/profile"),
  getDoctorAvailability: (doctorId: string, date: string) =>
    api.get(`/users/doctors/${doctorId}/availability`, { params: { date } }),
};

// Appointment Services
export const appointmentService = {
  getAppointments: () => api.get("/appointments/"),
  getAppointment: (id: string) => api.get(`/appointments/${id}`),
  createAppointment: (appointmentData: {
    doctorId: string;
    appointmentDate: string;
    appointmentTime: string;
    comments: string;
    patientAge: number;
    patientSex: string;
  }) => api.post("/appointments/", appointmentData),
  updateAppointment: (
    id: string,
    appointmentData: {
      appointmentDate?: string;
      appointmentTime?: string;
      patientAge?: number;
      patientSex?: string;
      comments?: string;
    }
  ) => api.put(`/appointments/${id}`, appointmentData),
  updateAppointmentStatus: (id: string, status: string) =>
    api.put(`/appointments/${id}/status`, { status }),
  cancelAppointment: (id: string) => api.put(`/appointments/${id}/cancel`),
};

export default api;
