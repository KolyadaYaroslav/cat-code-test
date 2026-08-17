// Адаптер для подключения бэкенда к существующему Store
// Этот файл должен загружаться ПОСЛЕ api.js и store.js

(function () {
  // Флаг: использовать бэкенд или локальное хранилище
  const USE_BACKEND = true; // Переключатель для отладки

  // Сохраним оригинальные методы Store
  const OriginalStore = { ...window.Store };

  // Кэш данных
  let catalogCache = [];
  let categoriesCache = [];

  // Инициализация: загружаем каталог с бэкенда
  async function initCatalog() {
    try {
      const products = await Api.getProducts();
      catalogCache = products;
      
      // Кэшируем категории
      const categories = await Api.getCategories();
      categoriesCache = categories;

      // Обновляем глобальные данные для совместимости с фронтендом
      window.CATALOG = catalogCache;
      window.CATEGORIES = categoriesCache;

      console.log("Каталог загружен с бэкенда:", catalogCache.length, "товаров");
    } catch (error) {
      console.warn("Не удалось загрузить каталог:", error);
      // Fallback: используем локальные данные если есть
      if (window.CATALOG) {
        catalogCache = window.CATALOG;
        if (window.CATEGORIES) categoriesCache = window.CATEGORIES;
      }
    }
  }

  // Восстановление сессии если есть токен
  async function restoreSession() {
    const token = Api.getToken();
    if (token) {
      try {
        const user = await Api.getMe();
        if (user) {
          // Восстанавливаем пользователя в Store
          window.Store.get().user = user;
          console.log("Сессия восстановлена:", user.email);
        }
      } catch (error) {
        console.warn("Не удалось восстановить сессию:", error);
        Api.logout();
      }
    }
  }

  // Переопределяем Store методы для работы с бэкенд
  if (USE_BACKEND) {
    // Регистрация через бэкенд
    const originalRegister = window.Store.register;
    window.Store.register = async function (data) {
      try {
        const user = await Api.register(data.name, data.email, data.password);
        // Сохраняем в локальный Store
        const state = window.Store.get();
        state.user = user;
        window.Store.emit?.();
        return user;
      } catch (error) {
        throw new Error(error.message || "Ошибка регистрации");
      }
    };

    // Вход через бэкенд
    const originalLogin = window.Store.login;
    window.Store.login = async function (data) {
      try {
        const user = await Api.login(data.email, data.password);
        // Сохраняем в локальный Store
        const state = window.Store.get();
        state.user = user;
        window.Store.emit?.();
        return user;
      } catch (error) {
        throw new Error(error.message || "Неверный e-mail или пароль");
      }
    };

    // Выход
    const originalLogout = window.Store.logout;
    window.Store.logout = function () {
      Api.logout();
      const state = window.Store.get();
      state.user = null;
      window.Store.emit?.();
    };

    // Оформление заказа через бэкенд
    const originalPlaceOrder = window.Store.placeOrder;
    window.Store.placeOrder = async function (data) {
      const items = window.Store.cartDetailed();
      if (!items.length) throw new Error("Корзина пуста");

      const state = window.Store.get();
      if (!state.user) throw new Error("Требуется авторизация");

      try {
        // Формируем items для бэкенда
        const orderItems = items.map((item) => ({
          productId: parseInt(item.id),
          quantity: item.qty,
          price: item.price,
        }));

        const order = await Api.createOrder(
          data.address.name,
          data.address.phone,
          data.address.address,
          data.payment ? "card" : "cash",
          orderItems
        );

        // Очищаем корзину
        state.cart = [];

        // Формируем номер заказа для фронтенда
        const orderNumber = `ORD-${String(order.id).padStart(6, "0")}`;

        // Сохраняем в локальный Store для совместимости
        const fullOrder = {
          number: orderNumber,
          email: state.user.email,
          customer: state.user.name,
          items: items.map((i) => ({
            id: i.id,
            name: i.name,
            price: i.price,
            qty: i.qty,
            unit: i.unit,
          })),
          total: order.total,
          address: data.address,
          payment: {
            method: order.payment_method === "card" ? "Карта" : "Наличные",
          },
          status: "created",
          history: [{ status: "created", at: order.created_at }],
          createdAt: order.created_at,
        };

        state.orders.unshift(fullOrder);
        window.Store.emit?.();

        console.log("Заказ создан:", orderNumber);
        return fullOrder;
      } catch (error) {
        throw new Error(error.message || "Ошибка при создании заказа");
      }
    };
  }

  // Инициализация при загрузке
  window.addEventListener("DOMContentLoaded", async () => {
    await initCatalog();
    await restoreSession();
  });

  // Если уже загружен - инициализируем сразу
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", async () => {
      await initCatalog();
      await restoreSession();
    });
  } else {
    initCatalog();
    restoreSession();
  }

  window.ApiAdapter = { initCatalog, restoreSession };
})();
