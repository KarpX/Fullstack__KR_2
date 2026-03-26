import { use, useEffect, useMemo, useState } from "react";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "./api/productsApi";
import { register, login, getMe } from "./api/authApi";
import { getUsers, setUserRole } from "./api/adminApi";
import "./app.css";

/**
 * Практика 4 (заготовка).
 * Важно: это НЕ готовое решение. В файле api/productsApi.js стоят TODO.
 * Цель: подключить React к вашему Express API и выполнить базовый CRUD.
 */
export default function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Минимальная форма добавления товара
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [img, setImg] = useState("");

  const [searchCategory, setSearchCategory] = useState("");
  const [searchPrice, setSearchPrice] = useState("");
  const [deleteName, setDeleteName] = useState("");

  // Состояния для аутентификации
  const [user, setUser] = useState(null); // Текущий профиль
  const [authMode, setAuthMode] = useState("login"); // 'login' или 'register'
  const [authData, setAuthData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  });

  // Проверка профиля при загрузке страницы
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      checkProfile();
    }
    load();
  }, []);

  async function checkProfile() {
    try {
      console.log("checking...");
      const data = await getMe(); // Запрос GET /api/auth/me
      setUser(data);
    } catch (e) {
      localStorage.removeItem("accessToken");
      setUser(null);
    }
  }

  async function handleAuth(e) {
    e.preventDefault();
    setError("");
    try {
      if (authMode === "login") {
        await login({ email: authData.email, password: authData.password }); // POST /api/auth/login
      } else {
        await register(authData); // POST /api/auth/register
        setAuthMode("login");
        alert("Регистрация успешна! Теперь войдите.");
        return;
      }
      await checkProfile();
      setAuthData({ email: "", password: "", first_name: "", last_name: "" });
    } catch (e) {
      console.error("ПОЛНАЯ ОШИБКА АВТОРИЗАЦИИ:", e);
      console.log("ДАННЫЕ ОТВЕТА СЕРВЕРА:", e.response?.data);

      setError(
        e.response?.data?.message || e.message || "Ошибка аутентификации",
      );
    }
  }

  function handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
  }

  const [usersList, setUsersList] = useState([]);
  const [roleError, setRoleError] = useState("");
  const [roleLoading, setRoleLoading] = useState(false);

  async function loadUsers() {
    if (user?.role !== "admin") return;
    setRoleError("");
    setRoleLoading(true);
    try {
      const list = await getUsers();
      setUsersList(list);
    } catch (e) {
      setRoleError(String(e?.response?.data?.message || e?.message || e));
    } finally {
      setRoleLoading(false);
    }
  }

  async function handleRoleChange(userId, newRole) {
    try {
      await setUserRole(userId, newRole);
      loadUsers();
    } catch (e) {
      alert("Не удалось изменить роль");
    }
  }

  useEffect(() => {
    if (user?.role === "admin") {
      loadUsers();
    }
  }, [user]);

  const canSubmit = useMemo(
    () => title.trim() !== "" && price !== "",
    [title, price],
  );

  async function load() {
    setError("");
    setLoading(true);
    try {
      const data = await getProducts(); // TODO: заработает после реализации productsApi.js
      setItems(data);
      console.log("items", items);
    } catch (e) {
      setError(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function loadOneCategory() {
    setError("");
    setLoading(true);
    try {
      const data = await getProductsByCategory(searchCategory); // TODO: заработает после реализации productsApi.js
      setItems(data);
      console.log("items", items);
    } catch (e) {
      setError(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }

  async function loadOnePrice() {
    setError("");
    setLoading(true);
    try {
      const data = await getProductsByPrice(searchPrice); // TODO: заработает после реализации productsApi.js
      setItems(data);
      console.log("items", items);
    } catch (e) {
      setError(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }

  async function onAdd(e) {
    e.preventDefault();
    if (!canSubmit) return;

    setError("");
    try {
      await createProduct({
        title: title.trim(),
        // TODO (студентам): дополнить payload полями category/description/stock/...
        price: Number(price),
        description: description.trim(),
        stock: Number(stock),
        category: category.trim(),
        imageUrl: img.trim(),
      });
      setTitle("");
      setPrice("");
      setDescription("");
      setStock("");
      setCategory("");
      setImg("");
      await load();
    } catch (e) {
      setError(String(e?.message || e));
    }
  }

  async function onDelete(id) {
    setError("");
    try {
      await deleteProduct(id);
      await load();
    } catch (e) {
      setError(String(e?.message || e));
    }
  }

  async function onDeleteName() {
    setError("");
    try {
      await deleteProductByName(deleteName);
      await load();
    } catch (e) {
      setError(String(e?.message || e));
    }
    setDeleteName("");
  }

  async function onPricePlus(id, currentPrice) {
    setError("");
    try {
      await updateProduct(id, { price: Number(currentPrice) + 10 });
      await load();
    } catch (e) {
      setError(String(e?.message || e));
    }
  }

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: 24,
        fontFamily: "system-ui",
      }}
    >
      <h1>Практика 4 — React + Express API</h1>

      <section
        style={{
          marginBottom: 24,
          padding: 16,
          backgroundColor: "#f9f9f9",
          borderRadius: 12,
        }}
      >
        {user ? (
          <div>
            <p>
              Вы вошли как:{" "}
              <b>
                {user.first_name} {user.last_name}
              </b>{" "}
              {`Email: ${user.email}`}
            </p>
            <p>{`Роль: ${user.role}`}</p>
            <button onClick={handleLogout}>Выйти</button>
          </div>
        ) : (
          <div>
            <h2>{authMode === "login" ? "Вход" : "Регистрация"}</h2>
            <form
              onSubmit={handleAuth}
              style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
            >
              <input
                placeholder="Email"
                value={authData.email}
                onChange={(e) =>
                  setAuthData({ ...authData, email: e.target.value })
                }
                required
              />
              <input
                type="password"
                placeholder="Пароль"
                value={authData.password}
                onChange={(e) =>
                  setAuthData({ ...authData, password: e.target.value })
                }
                required
              />
              {authMode === "register" && (
                <>
                  <input
                    placeholder="Имя"
                    value={authData.first_name}
                    onChange={(e) =>
                      setAuthData({ ...authData, first_name: e.target.value })
                    }
                  />
                  <input
                    placeholder="Фамилия"
                    value={authData.last_name}
                    onChange={(e) =>
                      setAuthData({ ...authData, last_name: e.target.value })
                    }
                  />
                </>
              )}
              <button type="submit">
                {authMode === "login" ? "Войти" : "Создать аккаунт"}
              </button>
              <button
                type="button"
                onClick={() =>
                  setAuthMode(authMode === "login" ? "register" : "login")
                }
              >
                {authMode === "login" ? "Нет аккаунта?" : "Уже есть аккаунт?"}
              </button>
            </form>
          </div>
        )}
      </section>

      {user?.role === "admin" && (
        <section
          style={{
            marginTop: 40,
            padding: 20,
            border: "2px solid #000",
            borderRadius: 20,
            backgroundColor: "#fff4f4",
          }}
        >
          <h2>Админ-панель: Управление пользователями</h2>
          <table style={{ width: "100%", textAlign: "left" }}>
            <thead>
              <tr>
                <th>Email</th>
                <th>Имя</th>
                <th>Текущая роль</th>
                <th>Действие</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map((u) => (
                <tr key={u.id}>
                  <td>{u.email}</td>
                  <td>
                    {u.first_name} {u.last_name}
                  </td>
                  <td>
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: 10,
                        background: u.role === "admin" ? "#ff4d4d" : "#ccc",
                        color: u.role === "admin" ? "white" : "black",
                      }}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <section
        style={{
          marginTop: 24,
          padding: 16,
          border: "1px solid #ddd",
          borderRadius: 12,
        }}
        id="product-add"
      >
        <h2 style={{ marginTop: 0 }}>Добавить товар</h2>
        <form
          onSubmit={onAdd}
          style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
        >
          <div className="inputs">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Название"
            />
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Цена"
              type="number"
            />
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Категория"
              type="string"
            ></input>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Описание"
              type="string"
            ></input>
            <input
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="Остаток на складе"
              type="number"
            ></input>
            <input
              id="img"
              value={img}
              onChange={(e) => setImg(e.target.value)}
              placeholder="URL картинки"
              type="string"
            ></input>
          </div>

          <div className="buttons">
            <button disabled={!canSubmit} style={{ padding: "10px 14px" }}>
              Добавить
            </button>
            <button
              type="button"
              onClick={load}
              style={{ padding: "10px 14px" }}
            >
              Обновить список
            </button>
          </div>
        </form>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Список товаров</h2>
        {loading && <p>Загрузка...</p>}
        {error && (
          <p style={{ color: "crimson" }}>
            Ошибка: {error}
            <br />
            Проверьте, что: (1) backend запущен на 3000, (2) CORS настроен, (3)
            TODO в productsApi.js реализованы.
          </p>
        )}

        <ul style={{ paddingLeft: 18 }}>
          {items.map((p) => (
            <li key={p.id} style={{ marginBottom: 8 }}>
              <img src={p.imageUrl} alt={p.title} />
              <div id="main-info">
                <h2>
                  <b>{p.title}</b>
                </h2>
                <p id="category">{p.category} </p>
              </div>
              <div id="description">
                <p>{p.description}</p>
                <div id="price">
                  <p id="price">{p.price} ₽ </p>
                  <p>{`На складе: ${p.stock}`}</p>
                </div>
              </div>

              <div className="buttons">
                <button
                  onClick={() => onPricePlus(p.id, p.price)}
                  style={{ marginLeft: 8 }}
                >
                  +10 ₽
                </button>
                <button
                  onClick={() => onDelete(p.id)}
                  style={{ marginLeft: 8 }}
                >
                  Удалить
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
