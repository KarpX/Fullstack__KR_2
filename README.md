# Фронтенд и бэкенд разработка
## Контрольная работа №2

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (защищён: авторизация)

### Admin
- `GET /api/admin/users` (защищён: роль – `admin`, авторизация)
- `PATCH /api/admin/users/{id}/role` (защищён: роль – `admin`, авторизация)

### Products
- `GET /api/products/:id` (защищён: авторизация)
- `PUT /api/products/:id` (защищён: роль – `admin`, авторизация)
- `PATCH /api/products/:id` (защищён: роль – `admin`, авторизация)
- `DELETE /api/products/:id` (защищён: роль – `admin`, авторизация)
- `GET /api/products`
- `POST /api/products` (защищён: авторизация)
