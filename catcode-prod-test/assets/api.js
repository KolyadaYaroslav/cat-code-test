// API клиент для работы с бэкендом
(function () {
  const API_BASE = "http://localhost:3000/api";

  const Api = {
    // Получить токен из localStorage
    getToken() {
      return localStorage.getItem("auth_token");
    },

    // Сохранить токен в localStorage
    setToken(token) {
      if (token) {
        localStorage.setItem("auth_token", token);
      } else {
        localStorage.removeItem("auth_token");
      }
    },

    // Базовый fetch с автоматической обработкой ошибок
    async request(method, path, body = null) {
      const options = {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      };

      const token = Api.getToken();
      if (token) {
        options.headers.Authorization = `Bearer ${token}`;
      }

      if (body) {
        options.body = JSON.stringify(body);
      }

      try {
        const response = await fetch(`${API_BASE}${path}`, options);

        // Обработка ответа
        let data;
        try {
          data = await response.json();
        } catch {
          data = null;
        }

        if (!response.ok) {
          const errorMsg = data?.error || `HTTP ${response.status}`;
          throw new Error(errorMsg);
        }

        return data;
      } catch (error) {
        console.error(`API ${method} ${path}:`, error);
        throw error;
      }
    },

    // ---------- Аутентификация ----------
    async register(name, email, password) {
      const data = await Api.request("POST", "/auth/register", { name, email, password });
      Api.setToken(data.token);
      return data.user;
    },

    async login(email, password) {
      const data = await Api.request("POST", "/auth/login", { email, password });
      Api.setToken(data.token);
      return data.user;
    },

    async getMe() {
      try {
        return await Api.request("GET", "/auth/me");
      } catch {
        Api.setToken(null);
        return null;
      }
    },

    logout() {
      Api.setToken(null);
    },

    // ---------- Товары ----------
    async getProducts() {
      return Api.request("GET", "/products");
    },

    async getProduct(id) {
      return Api.request("GET", `/products/${id}`);
    },

    async getCategories() {
      return Api.request("GET", "/products/categories/list");
    },

    async searchProducts(query) {
      return Api.request("GET", `/products/search/query?q=${encodeURIComponent(query)}`);
    },

    // ---------- Заказы ----------
    async createOrder(recipientName, recipientPhone, address, paymentMethod, items) {
      return Api.request("POST", "/orders", {
        recipientName,
        recipientPhone,
        address,
        paymentMethod,
        items,
      });
    },

    async getOrders() {
      return Api.request("GET", "/orders");
    },

    async getOrder(id) {
      return Api.request("GET", `/orders/${id}`);
    },

    async updateOrderStatus(id, status) {
      return Api.request("PATCH", `/orders/${id}/status`, { status });
    },

    async getNextStatus(id) {
      const data = await Api.request("GET", `/orders/${id}/next-status`);
      return data.nextStatus;
    },
  };

  window.Api = Api;
})();
