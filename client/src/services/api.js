import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token on every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authService = {
  signup: (data) => api.post("/auth/signup", data),
  login: (data) => api.post("/auth/login", data),
};

export const expenseService = {
  getAll: () => api.get("/expenses"),
  create: (data) => api.post("/expenses", data),
  delete: (id) => api.delete(`/expenses/${id}`),
};

export const budgetService = {
  get: () => api.get("/budget"),
  set: (data) => api.post("/budget", data),
};

export const transactionService = {
  getAll: () => api.get("/transactions"),
  create: (data) => api.post("/transactions", data),
  update: (id, data) => api.put(`/transactions/${id}`, data),
  delete: (id) => api.delete(`/transactions/${id}`),
};

export const paymentAccountService = {
  getAll: () => api.get("/accounts"),
  create: (data) => api.post("/accounts", data),
  update: (id, data) => api.put(`/accounts/${id}`, data),
  delete: (id) => api.delete(`/accounts/${id}`),
};

export const categoryService = {
  getAll: () => api.get("/categories"),
  create: (data) => api.post("/categories", data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

export const incomeService = {
  getAll: () => api.get("/income"),
  create: (data) => api.post("/income", data),
  delete: (id) => api.delete(`/income/${id}`),
};

export default api;
