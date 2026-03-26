/**
 * usersStore.js — учебное хранилище пользователей в памяти процесса Node.js.
 *
 * Практики 7–8:
 * - хранение пользователей без БД (users[])
 *
 * Практика 11:
 * - добавляем role (admin/user)
 *
 * Ограничение:
 * - после перезапуска сервера массив очищается.
 * - в реальном проекте: БД (Postgres/Mongo) или хотя бы файл.
 */

const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");
const passwordHash = bcrypt.hash(String("admin"), 10);
console.log(passwordHash);

const users = [
  {
    id: nanoid(8),
    email: "admin@admin.com",
    first_name: "admin",
    last_name: "admin",
    passwordHash:
      "$2a$10$.dvrlFXYduJVuANY0s9gpe4kR5kvq1jEtZ1L/txLlNHqV7.rU3MoS", // ВАЖНО: храним только хеш, не пароль
    role: "admin",
  },
];

function publicUser(u) {
  // Никогда не отдаём passwordHash наружу
  // eslint-disable-next-line no-unused-vars
  const { passwordHash, ...rest } = u;
  return rest;
}

module.exports = { users, publicUser };
