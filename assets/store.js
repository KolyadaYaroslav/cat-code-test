// Простое хранилище состояния поверх localStorage + событийная модель.
(function () {
  const LS_KEY = "vetstore_state_v1";

  const defaultState = {
    user: null, // { name, email, password }
    cart: [], // [{ id, qty }]
    orders: [], // [{ number, email, items, total, address, payment, status, history, createdAt }]
    users: [], // зарегистрированные пользователи (демо, пароли в открытом виде — только для примера!)
  };

  function load() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return { ...defaultState };
      return { ...defaultState, ...JSON.parse(raw) };
    } catch (e) {
      console.warn("Не удалось прочитать состояние:", e);
      return { ...defaultState };
    }
  }

  let state = load();
  const listeners = new Set();

  function persist() {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  }

  function emit() {
    persist();
    listeners.forEach((fn) => fn(state));
  }

  const Store = {
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    get() {
      return state;
    },

    // ---------- Каталог ----------
    product(id) {
      return window.CATALOG.find((p) => p.id === id) || null;
    },

    // ---------- Корзина ----------
    addToCart(id, qty = 1) {
      const line = state.cart.find((l) => l.id === id);
      if (line) line.qty += qty;
      else state.cart.push({ id, qty });
      emit();
    },
    setQty(id, qty) {
      const line = state.cart.find((l) => l.id === id);
      if (!line) return;
      line.qty = Math.max(1, qty);
      emit();
    },
    removeFromCart(id) {
      state.cart = state.cart.filter((l) => l.id !== id);
      emit();
    },
    clearCart() {
      state.cart = [];
      emit();
    },
    cartDetailed() {
      return state.cart
        .map((l) => {
          const p = Store.product(l.id);
          return p ? { ...p, qty: l.qty, sum: p.price * l.qty } : null;
        })
        .filter(Boolean);
    },
    cartCount() {
      return state.cart.reduce((s, l) => s + l.qty, 0);
    },
    cartTotal() {
      return Store.cartDetailed().reduce((s, l) => s + l.sum, 0);
    },

    // ---------- Авторизация ----------
    register({ name, email, password }) {
      email = email.trim().toLowerCase();
      if (state.users.some((u) => u.email === email)) {
        throw new Error("Пользователь с таким e-mail уже зарегистрирован");
      }
      const user = { name: name.trim(), email, password };
      state.users.push(user);
      state.user = { name: user.name, email: user.email };
      emit();
      return state.user;
    },
    login({ email, password }) {
      email = email.trim().toLowerCase();
      const u = state.users.find((x) => x.email === email && x.password === password);
      if (!u) throw new Error("Неверный e-mail или пароль");
      state.user = { name: u.name, email: u.email };
      emit();
      return state.user;
    },
    logout() {
      state.user = null;
      emit();
    },

    // ---------- Заказы / биллинг ----------
    placeOrder({ address, payment }) {
      const items = Store.cartDetailed();
      if (!items.length) throw new Error("Корзина пуста");
      const total = Store.cartTotal();
      const number = genOrderNumber();
      const now = new Date().toISOString();
      const order = {
        number,
        email: state.user ? state.user.email : "guest",
        customer: state.user ? state.user.name : address.name,
        items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, qty: i.qty, unit: i.unit })),
        total,
        address,
        payment: maskPayment(payment),
        status: "created",
        history: [{ status: "created", at: now }],
        createdAt: now,
      };
      state.orders.unshift(order);
      state.cart = [];
      emit();
      // Имитация обработки: заказ автоматически «оплачивается» и продвигается по статусам.
      simulateProgress(number);
      return order;
    },
    ordersOf(email) {
      return state.orders.filter((o) => o.email === email);
    },
    myOrders() {
      if (!state.user) return [];
      return Store.ordersOf(state.user.email);
    },
    findOrder(number) {
      return state.orders.find((o) => o.number === number) || null;
    },
    advanceOrder(number) {
      const o = Store.findOrder(number);
      if (!o) return;
      const idx = window.ORDER_STATUSES.findIndex((s) => s.key === o.status);
      if (idx < window.ORDER_STATUSES.length - 1) {
        o.status = window.ORDER_STATUSES[idx + 1].key;
        o.history.push({ status: o.status, at: new Date().toISOString() });
        emit();
      }
    },
  };

  function genOrderNumber() {
    const d = new Date();
    const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
    const rnd = Math.floor(1000 + Math.random() * 9000);
    return `AI-${ymd}-${rnd}`;
  }

  function maskPayment(payment) {
    if (!payment || !payment.card) return { method: "Наличные при доставке" };
    const digits = payment.card.replace(/\D/g, "");
    return { method: "Карта", last4: digits.slice(-4) };
  }

  // Демо-имитация продвижения заказа по статусам во времени.
  function simulateProgress(number) {
    const steps = [4000, 6000, 9000, 12000]; // мс до paid, assembling, shipped, delivered
    steps.forEach((ms) => setTimeout(() => Store.advanceOrder(number), ms));
  }

  window.Store = Store;
})();
