// Мини-SPA: хеш-роутер + рендер экранов. Никаких зависимостей.
(function () {
  const app = document.getElementById("app");
  const nav = document.getElementById("nav");

  const money = (n) => n.toLocaleString("ru-RU") + " ₽";
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmtDate = (iso) =>
    new Date(iso).toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

  // Локальное состояние UI каталога
  const ui = { category: "Все", query: "" };

  // ---------------- Роутер ----------------
  const routes = {
    "": renderCatalog,
    catalog: renderCatalog,
    product: renderProduct,
    cart: renderCart,
    checkout: renderCheckout,
    orders: renderOrders,
    order: renderOrderDetail,
    track: renderTrack,
    cabinet: renderCabinet,
    login: renderLogin,
  };

  function parseHash() {
    const raw = location.hash.replace(/^#\/?/, "");
    const [name, ...params] = raw.split("/");
    return { name: name || "", params };
  }

  function render() {
    const { name, params } = parseHash();
    const view = routes[name] || renderNotFound;
    app.innerHTML = view(...params);
    window.scrollTo(0, 0);
    bindPage(name);
    renderNav(name);
  }

  function go(hash) {
    location.hash = hash;
  }

  // ---------------- Навигация ----------------
  function renderNav(active) {
    const s = Store.get();
    const count = Store.cartCount();
    const cabinetLabel = s.user ? esc(s.user.name.split(" ")[0]) : "Войти";
    nav.innerHTML = `
      <a href="#/catalog" data-r="catalog">Каталог</a>
      <a href="#/track" data-r="track">Отследить</a>
      <a href="#/cart" data-r="cart">Корзина${count ? `<span class="cart-badge">${count}</span>` : ""}</a>
      <a href="#/${s.user ? "cabinet" : "login"}" data-r="${s.user ? "cabinet" : "login"}">${s.user ? "👤 " + cabinetLabel : "Войти"}</a>
    `;
    nav.querySelectorAll("a").forEach((a) => {
      if (a.dataset.r === active || (active === "" && a.dataset.r === "catalog")) a.classList.add("active");
    });
  }

  // ---------------- Экран: Каталог ----------------
  function renderCatalog() {
    const chips = window.CATEGORIES.map(
      (c) => `<button class="chip ${c === ui.category ? "active" : ""}" data-cat="${esc(c)}">${esc(c)}</button>`
    ).join("");

    let items = window.CATALOG;
    if (ui.category !== "Все") items = items.filter((p) => p.category === ui.category);
    if (ui.query.trim()) {
      const q = ui.query.trim().toLowerCase();
      items = items.filter(
        (p) => p.name.toLowerCase().includes(q) || (p.tags || []).some((t) => t.includes(q))
      );
    }

    const cards = items
      .map(
        (p) => `
      <div class="card">
        <a class="thumb" href="#/product/${p.id}">${p.icon}</a>
        <div class="body">
          <div class="cat">${esc(p.category)}</div>
          <h3><a href="#/product/${p.id}">${esc(p.name)}</a></h3>
          <div><span class="price">${money(p.price)}</span> <span class="unit">/ ${esc(p.unit)}</span></div>
          <div class="actions">
            <button class="btn block" data-add="${p.id}">В корзину</button>
          </div>
        </div>
      </div>`
      )
      .join("");

    return `
      <section class="hero">
        <h1>🐄 ВетГенетика — товары для осеменения КРС</h1>
        <p>Семя быков-производителей, жидкий азот, инструменты и расходные материалы для искусственного осеменения. Доставка по всей стране.</p>
      </section>
      <div class="toolbar">
        <input class="search" id="search" type="search" placeholder="Поиск по товарам…" value="${esc(ui.query)}">
        <div class="chips">${chips}</div>
      </div>
      <div class="grid">${cards || `<div class="empty"><div class="big">🔍</div>Ничего не найдено</div>`}</div>
    `;
  }

  // ---------------- Экран: Товар ----------------
  function renderProduct(id) {
    const p = Store.product(id);
    if (!p) return renderNotFound();
    const tags = (p.tags || []).map((t) => `<span class="status-pill">${esc(t)}</span>`).join(" ");
    return `
      <a class="muted" href="#/catalog">← Назад в каталог</a>
      <div class="panel" style="margin-top:14px; display:grid; grid-template-columns: 200px 1fr; gap:24px;">
        <div class="thumb" style="height:200px; border-radius:12px; font-size:96px; background:var(--brand-soft); display:flex; align-items:center; justify-content:center;">${p.icon}</div>
        <div>
          <div class="cat">${esc(p.category)}</div>
          <h1 class="page-title" style="margin:6px 0 10px;">${esc(p.name)}</h1>
          <p>${esc(p.description)}</p>
          <div style="margin:12px 0;">${tags}</div>
          <div class="row-between">
            <div><span class="price" style="font-size:28px; font-weight:800; color:var(--brand-dark);">${money(p.price)}</span> <span class="unit">/ ${esc(p.unit)}</span></div>
            <div class="muted">В наличии: ${p.inStock}</div>
          </div>
          <div style="margin-top:16px;">
            <button class="btn" data-add="${p.id}">Добавить в корзину</button>
            <a class="btn secondary" href="#/cart">Перейти в корзину</a>
          </div>
        </div>
      </div>`;
  }

  // ---------------- Экран: Корзина ----------------
  function renderCart() {
    const lines = Store.cartDetailed();
    if (!lines.length) {
      return `
        <h1 class="page-title">Корзина</h1>
        <div class="panel empty">
          <div class="big">🛒</div>
          <p>Корзина пуста</p>
          <a class="btn" href="#/catalog">Перейти в каталог</a>
        </div>`;
    }
    const rows = lines
      .map(
        (l) => `
      <div class="line">
        <div class="li-icon">${l.icon}</div>
        <div>
          <div class="li-name">${esc(l.name)}</div>
          <div class="li-unit">${money(l.price)} / ${esc(l.unit)}</div>
        </div>
        <div class="qty" data-id="${l.id}">
          <button data-op="dec">−</button>
          <input type="number" min="1" value="${l.qty}" data-qty>
          <button data-op="inc">+</button>
        </div>
        <div class="li-sum">${money(l.sum)}</div>
        <button class="btn danger" data-remove="${l.id}" title="Удалить">✕</button>
      </div>`
      )
      .join("");

    return `
      <h1 class="page-title">Корзина</h1>
      <div class="panel">
        ${rows}
        <div class="summary">
          <button class="btn secondary sm" id="clear-cart">Очистить</button>
          <div>Итого: <span class="total">${money(Store.cartTotal())}</span></div>
        </div>
      </div>
      <div class="row-between">
        <a class="btn secondary" href="#/catalog">← Продолжить покупки</a>
        <a class="btn" href="#/checkout">Оформить заказ →</a>
      </div>`;
  }

  // ---------------- Экран: Оформление / биллинг ----------------
  function renderCheckout() {
    const lines = Store.cartDetailed();
    if (!lines.length) {
      go("#/cart");
      return "";
    }
    const s = Store.get();
    const summary = lines
      .map((l) => `<div class="row-between"><span>${esc(l.name)} × ${l.qty}</span><b>${money(l.sum)}</b></div>`)
      .join("");

    return `
      <h1 class="page-title">Оформление заказа</h1>
      <div id="msg"></div>
      <div style="display:grid; grid-template-columns: 1.4fr 1fr; gap:18px; align-items:start;">
        <form class="panel" id="checkout-form">
          <h3 style="margin-top:0;">Данные получателя</h3>
          <div class="form-grid">
            <div class="field full">
              <label>ФИО / название хозяйства</label>
              <input name="name" required value="${s.user ? esc(s.user.name) : ""}">
            </div>
            <div class="field">
              <label>Телефон</label>
              <input name="phone" required placeholder="+7 900 000-00-00">
            </div>
            <div class="field">
              <label>E-mail</label>
              <input name="email" type="email" required value="${s.user ? esc(s.user.email) : ""}">
            </div>
            <div class="field full">
              <label>Адрес доставки</label>
              <input name="address" required placeholder="Регион, район, населённый пункт, улица, дом">
            </div>
          </div>

          <h3>Оплата</h3>
          <div class="field">
            <label>Способ оплаты</label>
            <select name="method" id="pay-method">
              <option value="card">Банковская карта</option>
              <option value="cash">Наличные при доставке</option>
            </select>
          </div>
          <div id="card-fields" class="form-grid">
            <div class="field full">
              <label>Номер карты</label>
              <input name="card" inputmode="numeric" placeholder="0000 0000 0000 0000" maxlength="19">
            </div>
            <div class="field">
              <label>Срок (ММ/ГГ)</label>
              <input name="exp" placeholder="12/28" maxlength="5">
            </div>
            <div class="field">
              <label>CVC</label>
              <input name="cvc" inputmode="numeric" placeholder="123" maxlength="4">
            </div>
          </div>

          <button class="btn block" type="submit" style="margin-top:16px;">Оплатить ${money(Store.cartTotal())}</button>
        </form>

        <div class="panel">
          <h3 style="margin-top:0;">Ваш заказ</h3>
          ${summary}
          <hr style="border:none; border-top:1px solid var(--line); margin:12px 0;">
          <div class="row-between"><span>Товаров:</span><b>${Store.cartCount()} шт.</b></div>
          <div class="row-between" style="font-size:18px;"><span>К оплате:</span><b>${money(Store.cartTotal())}</b></div>
        </div>
      </div>`;
  }

  // ---------------- Экран: Список заказов (в кабинете) ----------------
  function renderOrders() {
    const s = Store.get();
    if (!s.user) {
      go("#/login");
      return "";
    }
    return ordersListHtml(Store.myOrders(), "Мои заказы");
  }

  function ordersListHtml(orders, title) {
    if (!orders.length) {
      return `<h1 class="page-title">${title}</h1><div class="panel empty"><div class="big">📦</div><p>Заказов пока нет</p><a class="btn" href="#/catalog">В каталог</a></div>`;
    }
    const rows = orders
      .map((o) => {
        const st = window.ORDER_STATUSES.find((x) => x.key === o.status);
        return `
        <div class="order-row">
          <div>
            <div class="badge-num">№ ${esc(o.number)}</div>
            <div class="muted">${fmtDate(o.createdAt)} · ${o.items.length} поз. · ${money(o.total)}</div>
          </div>
          <div style="display:flex; gap:10px; align-items:center;">
            <span class="status-pill">${st.icon} ${st.label}</span>
            <a class="btn sm secondary" href="#/order/${o.number}">Подробнее</a>
          </div>
        </div>`;
      })
      .join("");
    return `<h1 class="page-title">${title}</h1>${rows}`;
  }

  // ---------------- Экран: Детали заказа ----------------
  function renderOrderDetail(number) {
    const o = Store.findOrder(number);
    if (!o) return renderNotFound();
    return `
      <a class="muted" href="#/orders">← К заказам</a>
      <h1 class="page-title" style="margin-top:10px;">Заказ <span class="badge-num">№ ${esc(o.number)}</span></h1>
      ${trackerHtml(o.status)}
      <div class="panel">
        <div class="row-between">
          <div>
            <div class="muted">Оформлен: ${fmtDate(o.createdAt)}</div>
            <div class="muted">Получатель: ${esc(o.customer || o.address.name)}</div>
            <div class="muted">Адрес: ${esc(o.address.address)}</div>
            <div class="muted">Оплата: ${esc(o.payment.method)}${o.payment.last4 ? " ••" + o.payment.last4 : ""}</div>
          </div>
          ${o.status !== "delivered" ? `<button class="btn secondary sm" data-advance="${o.number}">Обновить статус →</button>` : `<span class="status-pill">✅ Доставлен</span>`}
        </div>
        <hr style="border:none; border-top:1px solid var(--line); margin:14px 0;">
        ${o.items.map((i) => `<div class="row-between"><span>${esc(i.name)} × ${i.qty}</span><b>${money(i.price * i.qty)}</b></div>`).join("")}
        <div class="row-between" style="font-size:18px; margin-top:10px;"><span>Итого:</span><b>${money(o.total)}</b></div>
      </div>
      <div class="panel">
        <h3 style="margin-top:0;">История статусов</h3>
        ${o.history
          .slice()
          .reverse()
          .map((h) => {
            const st = window.ORDER_STATUSES.find((x) => x.key === h.status);
            return `<div class="row-between"><span>${st.icon} ${st.label}</span><span class="muted">${fmtDate(h.at)}</span></div>`;
          })
          .join("")}
      </div>`;
  }

  function trackerHtml(status) {
    const idx = window.ORDER_STATUSES.findIndex((s) => s.key === status);
    return `<div class="tracker">${window.ORDER_STATUSES.map((s, i) => {
      const cls = i < idx ? "done" : i === idx ? "current" : "";
      return `<div class="step ${cls}"><span class="ic">${s.icon}</span>${s.label}</div>`;
    }).join("")}</div>`;
  }

  // ---------------- Экран: Отслеживание по номеру ----------------
  function renderTrack(number) {
    const found = number ? Store.findOrder(number) : null;
    let result = "";
    if (number && !found) {
      result = `<div class="notice err">Заказ № ${esc(number)} не найден. Проверьте номер.</div>`;
    } else if (found) {
      const st = window.ORDER_STATUSES.find((x) => x.key === found.status);
      result = `
        <div class="panel">
          <div class="row-between">
            <div class="badge-num">№ ${esc(found.number)}</div>
            <span class="status-pill">${st.icon} ${st.label}</span>
          </div>
          ${trackerHtml(found.status)}
          <a class="btn secondary sm" href="#/order/${found.number}">Открыть детали заказа</a>
        </div>`;
    }
    return `
      <h1 class="page-title">Отслеживание заказа</h1>
      <div class="panel">
        <form id="track-form">
          <div class="field">
            <label>Номер заказа</label>
            <input name="number" placeholder="AI-20250101-1234" value="${esc(number || "")}" required>
          </div>
          <button class="btn" type="submit">Отследить</button>
        </form>
      </div>
      ${result}`;
  }

  // ---------------- Экран: Кабинет ----------------
  function renderCabinet() {
    const s = Store.get();
    if (!s.user) {
      go("#/login");
      return "";
    }
    return `
      <h1 class="page-title">Личный кабинет</h1>
      <div class="panel">
        <div class="row-between">
          <div>
            <div style="font-size:18px; font-weight:700;">${esc(s.user.name)}</div>
            <div class="muted">${esc(s.user.email)}</div>
          </div>
          <button class="btn secondary sm" id="logout">Выйти</button>
        </div>
      </div>
      ${ordersListHtml(Store.myOrders(), "История заказов")}
    `;
  }

  // ---------------- Экран: Вход / регистрация ----------------
  function renderLogin() {
    return `
      <h1 class="page-title">Вход в кабинет</h1>
      <div id="msg"></div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:18px;">
        <form class="panel" id="login-form">
          <h3 style="margin-top:0;">У меня есть аккаунт</h3>
          <div class="field"><label>E-mail</label><input name="email" type="email" required></div>
          <div class="field"><label>Пароль</label><input name="password" type="password" required></div>
          <button class="btn block" type="submit">Войти</button>
        </form>
        <form class="panel" id="register-form">
          <h3 style="margin-top:0;">Регистрация</h3>
          <div class="field"><label>Имя / хозяйство</label><input name="name" required></div>
          <div class="field"><label>E-mail</label><input name="email" type="email" required></div>
          <div class="field"><label>Пароль</label><input name="password" type="password" required minlength="4"></div>
          <button class="btn block secondary" type="submit">Создать аккаунт</button>
        </form>
      </div>`;
  }

  function renderNotFound() {
    return `<div class="panel empty"><div class="big">🤷</div><p>Страница не найдена</p><a class="btn" href="#/catalog">На главную</a></div>`;
  }

  // ---------------- Привязка обработчиков ----------------
  function bindPage(name) {
    // Универсально: кнопки "в корзину"
    app.querySelectorAll("[data-add]").forEach((b) =>
      b.addEventListener("click", () => {
        Store.addToCart(b.dataset.add, 1);
        flash(b);
      })
    );

    if (name === "catalog" || name === "") {
      const search = document.getElementById("search");
      if (search) {
        search.addEventListener("input", (e) => {
          ui.query = e.target.value;
          const pos = e.target.selectionStart;
          render();
          const ns = document.getElementById("search");
          if (ns) {
            ns.focus();
            ns.setSelectionRange(pos, pos);
          }
        });
      }
      app.querySelectorAll(".chip").forEach((c) =>
        c.addEventListener("click", () => {
          ui.category = c.dataset.cat;
          render();
        })
      );
    }

    if (name === "cart") {
      app.querySelectorAll(".qty").forEach((q) => {
        const id = q.dataset.id;
        q.querySelector('[data-op="dec"]').addEventListener("click", () => {
          const cur = Store.cartDetailed().find((l) => l.id === id);
          Store.setQty(id, cur.qty - 1);
        });
        q.querySelector('[data-op="inc"]').addEventListener("click", () => {
          const cur = Store.cartDetailed().find((l) => l.id === id);
          Store.setQty(id, cur.qty + 1);
        });
        q.querySelector("[data-qty]").addEventListener("change", (e) => {
          Store.setQty(id, parseInt(e.target.value, 10) || 1);
        });
      });
      app.querySelectorAll("[data-remove]").forEach((b) =>
        b.addEventListener("click", () => Store.removeFromCart(b.dataset.remove))
      );
      const clr = document.getElementById("clear-cart");
      if (clr) clr.addEventListener("click", () => Store.clearCart());
    }

    if (name === "checkout") {
      const methodSel = document.getElementById("pay-method");
      const cardFields = document.getElementById("card-fields");
      const toggleCard = () => (cardFields.style.display = methodSel.value === "card" ? "" : "none");
      methodSel.addEventListener("change", toggleCard);
      toggleCard();

      const cardInput = document.querySelector('input[name="card"]');
      if (cardInput)
        cardInput.addEventListener("input", (e) => {
          let v = e.target.value.replace(/\D/g, "").slice(0, 16);
          e.target.value = v.replace(/(.{4})/g, "$1 ").trim();
        });

      document.getElementById("checkout-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const f = new FormData(e.target);
        const method = f.get("method");
        if (method === "card") {
          const card = (f.get("card") || "").replace(/\s/g, "");
          if (card.length < 16) return msg("Введите корректный номер карты (16 цифр)", "err");
          if (!/^\d{2}\/\d{2}$/.test(f.get("exp") || "")) return msg("Укажите срок действия в формате ММ/ГГ", "err");
          if ((f.get("cvc") || "").length < 3) return msg("Укажите CVC", "err");
        }
        try {
          const order = Store.placeOrder({
            address: {
              name: f.get("name"),
              phone: f.get("phone"),
              email: f.get("email"),
              address: f.get("address"),
            },
            payment: method === "card" ? { card: f.get("card") } : null,
          });
          go("#/order/" + order.number);
        } catch (err) {
          msg(err.message, "err");
        }
      });
    }

    if (name === "track") {
      const form = document.getElementById("track-form");
      if (form)
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          const num = new FormData(e.target).get("number").trim();
          go("#/track/" + encodeURIComponent(num));
        });
    }

    if (name === "order") {
      app.querySelectorAll("[data-advance]").forEach((b) =>
        b.addEventListener("click", () => Store.advanceOrder(b.dataset.advance))
      );
    }

    if (name === "cabinet") {
      const lo = document.getElementById("logout");
      if (lo) lo.addEventListener("click", () => Store.logout());
    }

    if (name === "login") {
      document.getElementById("login-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const f = new FormData(e.target);
        try {
          Store.login({ email: f.get("email"), password: f.get("password") });
          go("#/cabinet");
        } catch (err) {
          msg(err.message, "err");
        }
      });
      document.getElementById("register-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const f = new FormData(e.target);
        try {
          Store.register({ name: f.get("name"), email: f.get("email"), password: f.get("password") });
          go("#/cabinet");
        } catch (err) {
          msg(err.message, "err");
        }
      });
    }
  }

  function msg(text, kind) {
    const box = document.getElementById("msg");
    if (box) box.innerHTML = `<div class="notice ${kind}">${esc(text)}</div>`;
  }

  function flash(btn) {
    const old = btn.textContent;
    btn.textContent = "✓ Добавлено";
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = old;
      btn.disabled = false;
    }, 900);
  }

  // ---------------- Запуск ----------------
  // Перерисовываем навигацию (счётчик корзины) и активные экраны при изменении стора.
  Store.subscribe(() => {
    renderNav(parseHash().name);
    const cur = parseHash().name;
    // Экраны, которые должны реактивно обновляться при изменении данных.
    if (["cart", "order", "orders", "cabinet"].includes(cur)) render();
  });

  window.addEventListener("hashchange", render);
  render();
})();
