# NoteHub API

<p align="center">
  <a href="#-english">🇬🇧 English</a> • <a href="#-українська">🇺🇦 Українська</a>
</p>

---

## 🇬🇧 English

Backend for the **NoteHub** notes app: Express 5 + MongoDB (Mongoose).
Register/login, sessions using access/refresh tokens in httpOnly cookies,
notes CRUD (pagination, search, tag filter), user profile, avatar upload to
Cloudinary, password reset via email.

### 🔗 Live demo

| | |
| --- | --- |
| 🌐 App (frontend) | https://09-auth-black-six.vercel.app |
| ⚙️ API (backend) | https://nodejs-hw-5-xp1z.onrender.com |
| 📖 Swagger docs | https://nodejs-hw-5-xp1z.onrender.com/docs |
| 💻 Frontend repository | [`NoteHub_Front_End`](https://github.com/Anna-Ivanchenko/NoteHub_Front_End) |

> The backend runs on Render's free tier — after a period of inactivity the
> first request can take up to ~50 seconds while the service "wakes up",
> then it's fast.

These are two separate repositories that together form one full-stack app:
the frontend calls this API through `NEXT_PUBLIC_API_URL`.

### Features

- 📝 Notes CRUD: create, edit, delete
- 🔎 Search notes and filter by tag, list pagination
- 🔐 Register, login, logout, sessions via access/refresh tokens in httpOnly cookies
- 👤 User profile: update username, upload avatar (Cloudinary)
- 📧 Password reset via email
- 📚 Auto-generated Swagger docs for the whole API

### Stack

Express 5, Mongoose (MongoDB), bcrypt, JWT, celebrate/Joi (validation),
cookie-parser, cors, cloudinary, nodemailer, pino-http, Swagger UI.

### API

Base path is the server root (no `/api` prefix).

| Method | Path                         | Description                                          | Auth |
| ------ | ----------------------------- | ------------------------------------------------------ | :--: |
| POST   | `/auth/register`              | Register (email + password)                            |      |
| POST   | `/auth/login`                 | Login, sets the session cookie                          |      |
| POST   | `/auth/logout`                | Logout, clears the cookie                               |  ✅  |
| POST   | `/auth/refresh`               | Refresh the access token using the refresh token        |      |
| GET    | `/auth/session`                | Check/refresh the current session                       |      |
| POST   | `/auth/request-reset-email`   | Send a password reset email                             |      |
| POST   | `/auth/reset-password`        | Set a new password using the token from the email       |      |
| GET    | `/users/me`                    | Current user's data                                     |  ✅  |
| PATCH  | `/users/me`                    | Update username                                         |  ✅  |
| PATCH  | `/users/me/avatar`             | Upload/replace avatar (Cloudinary)                       |  ✅  |
| GET    | `/notes`                       | List notes (`page`, `perPage`, `search`, `tag`)          |  ✅  |
| GET    | `/notes/:noteId`               | Single note                                             |  ✅  |
| POST   | `/notes`                       | Create a note                                           |  ✅  |
| PATCH  | `/notes/:noteId`               | Update a note                                           |  ✅  |
| DELETE | `/notes/:noteId`               | Delete a note                                           |  ✅  |
| GET    | `/docs`                        | Swagger UI                                              |      |

Auth is handled via httpOnly cookies — `accessToken` / `refreshToken` /
`sessionId` — set after login or registration. Protected routes read them
through the `authenticate` middleware.

### Environment variables

This project doesn't ship a real `.env` file (it's git-ignored on purpose,
so secrets never end up in the repository). Instead, `.env.example` lists
every variable the app needs, with no real values — copy it to `.env` and
fill in your own:

```
PORT=3000
NODE_ENV=development
FRONTEND_DOMAIN=http://localhost:3001
MONGO_URL=mongodb://127.0.0.1:27017/notehub
JWT_SECRET=change-me-to-a-random-secret
SMTP_HOST=
SMTP_PORT=465
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM="NoteHub <no-reply@notehub.local>"
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

What each one is for:

- `FRONTEND_DOMAIN` — the address the frontend (`NoteHub_Front_End`) makes requests
  from; used for CORS and for the link in the password-reset email.
- `MONGO_URL` — your MongoDB connection string (local instance or an Atlas cluster).
- `JWT_SECRET` — any random string, used to sign tokens.
- `SMTP_*` — only needed for password-reset emails.
- `CLOUDINARY_*` — only needed for avatar upload.

The rest of the API works fine without `SMTP_*`/`CLOUDINARY_*` filled in.

### Running locally

```bash
npm install
cp .env.example .env      # fill in MONGO_URL and anything else you need
npm run dev                 # nodemon, http://localhost:3000
```

Requires an accessible MongoDB instance (local install or a free MongoDB
Atlas cluster). To test it together with the frontend, clone and run
[`NoteHub_Front_End`](https://github.com/Anna-Ivanchenko/NoteHub_Front_End) alongside it, and
set `NEXT_PUBLIC_API_URL=http://localhost:3000` in its `.env.local`.

### Deploying (Render.com)

1. New → Web Service → connect this repository.
2. Build Command: `npm install`, Start Command: `npm start`.
3. Fill in the environment variables from `.env.example` in the
   Environment tab (`MONGO_URL` — your Atlas connection string,
   `FRONTEND_DOMAIN` — the deployed frontend's URL from `NoteHub_Front_End`).
4. Once deployed, the backend is available at
   `https://<service>.onrender.com` — that's the URL to give the frontend
   as `NEXT_PUBLIC_API_URL`.

### Secrets and keys

- Nothing in `.env` gets committed to git (enforced via `.gitignore`).
- On Render, secrets are added through the service's **Environment** tab —
  they're encrypted and never appear in the public code or build logs.
- If a `.env` with real secrets is ever accidentally committed, rotate
  (change) those values immediately — deleting the file isn't enough,
  since the old version stays in git history.

---

## 🇺🇦 Українська

Бекенд застосунку нотаток **NoteHub**: Express 5 + MongoDB (Mongoose).
Реєстрація/логін, сесії на access/refresh токенах у httpOnly-кукі, CRUD
нотаток (пагінація, пошук, фільтр за тегом), профіль користувача,
завантаження аватарки в Cloudinary, скидання пароля через email.

### 🔗 Демо

| | |
| --- | --- |
| 🌐 Застосунок (фронтенд) | https://09-auth-black-six.vercel.app |
| ⚙️ API (бекенд) | https://nodejs-hw-5-xp1z.onrender.com |
| 📖 Swagger-документація | https://nodejs-hw-5-xp1z.onrender.com/docs |
| 💻 Репозиторій фронтенду | [`NoteHub_Front_End`](https://github.com/Anna-Ivanchenko/NoteHub_Front_End) |

> Бекенд задеплоєний на безкоштовному тарифі Render — після періоду
> неактивності перший запит може оброблятись до ~50 секунд (сервіс
> "прокидається"), далі працює швидко.

Це два окремі репозиторії, що разом утворюють один full-stack застосунок:
фронтенд звертається до цього API через `NEXT_PUBLIC_API_URL`.

### Можливості

- 📝 CRUD нотаток: створення, редагування, видалення
- 🔎 Пошук нотаток і фільтр за тегом, пагінація списку
- 🔐 Реєстрація, логін, логаут, сесії на access/refresh токенах у httpOnly-кукі
- 👤 Профіль користувача: зміна імені, завантаження аватарки (Cloudinary)
- 📧 Скидання пароля через email-лист
- 📚 Автогенерована Swagger-документація всього API

### Стек

Express 5, Mongoose (MongoDB), bcrypt, JWT, celebrate/Joi (валідація),
cookie-parser, cors, cloudinary, nodemailer, pino-http, Swagger UI.

### API

Базовий шлях — корінь сервера (без `/api`-префіксу).

| Метод  | Шлях                         | Опис                                                | Auth |
| ------ | ----------------------------- | ---------------------------------------------------- | :--: |
| POST   | `/auth/register`              | Реєстрація (email + пароль)                           |      |
| POST   | `/auth/login`                 | Логін, встановлює cookie-сесію                        |      |
| POST   | `/auth/logout`                | Логаут, очищає cookie                                 |  ✅  |
| POST   | `/auth/refresh`               | Оновити access-токен за refresh-токеном               |      |
| GET    | `/auth/session`                | Перевірити/оновити поточну сесію                      |      |
| POST   | `/auth/request-reset-email`   | Надіслати лист для скидання пароля                    |      |
| POST   | `/auth/reset-password`        | Встановити новий пароль за токеном з листа             |      |
| GET    | `/users/me`                    | Дані поточного користувача                            |  ✅  |
| PATCH  | `/users/me`                    | Оновити ім'я користувача                               |  ✅  |
| PATCH  | `/users/me/avatar`             | Завантажити/замінити аватар (Cloudinary)               |  ✅  |
| GET    | `/notes`                       | Список нотаток (`page`, `perPage`, `search`, `tag`)     |  ✅  |
| GET    | `/notes/:noteId`               | Одна нотатка                                          |  ✅  |
| POST   | `/notes`                       | Створити нотатку                                       |  ✅  |
| PATCH  | `/notes/:noteId`               | Оновити нотатку                                        |  ✅  |
| DELETE | `/notes/:noteId`               | Видалити нотатку                                       |  ✅  |
| GET    | `/docs`                        | Swagger UI                                            |      |

Авторизація — httpOnly-кукі `accessToken` / `refreshToken` / `sessionId`,
які виставляються після логіну чи реєстрації. Захищені маршрути читають їх
через middleware `authenticate`.

### Змінні середовища

У репозиторії немає реального `.env` — він навмисно в `.gitignore`, щоб
секрети ніколи не потрапляли в код. Натомість `.env.example` перелічує всі
потрібні застосунку змінні без реальних значень — скопіюй його в `.env` і
заповни своїми даними:

```
PORT=3000
NODE_ENV=development
FRONTEND_DOMAIN=http://localhost:3001
MONGO_URL=mongodb://127.0.0.1:27017/notehub
JWT_SECRET=change-me-to-a-random-secret
SMTP_HOST=
SMTP_PORT=465
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM="NoteHub <no-reply@notehub.local>"
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Що для чого:

- `FRONTEND_DOMAIN` — адреса, з якої фронтенд (`NoteHub_Front_End`) робить запити;
  використовується для CORS і для посилання у листі скидання пароля.
- `MONGO_URL` — рядок підключення до MongoDB (локальна база чи кластер Atlas).
- `JWT_SECRET` — будь-який випадковий рядок, використовується для підпису токенів.
- `SMTP_*` — потрібні лише для листів скидання пароля.
- `CLOUDINARY_*` — потрібні лише для завантаження аватарки.

Без `SMTP_*`/`CLOUDINARY_*` решта API працює нормально.

### Локальний запуск

```bash
npm install
cp .env.example .env      # заповни MONGO_URL і за потреби решту
npm run dev                # nodemon, http://localhost:3000
```

Потрібна доступна MongoDB (локальна інсталяція або безкоштовний кластер
на MongoDB Atlas). Щоб протестувати разом із фронтендом — заклонуй і
запусти [`NoteHub_Front_End`](https://github.com/Anna-Ivanchenko/NoteHub_Front_End) поруч і
вкажи в його `.env.local` `NEXT_PUBLIC_API_URL=http://localhost:3000`.

### Деплой (Render.com)

1. New → Web Service → підключи цей репозиторій.
2. Build Command: `npm install`, Start Command: `npm start`.
3. Заповни змінні середовища з `.env.example` у розділі Environment
   (`MONGO_URL` — рядок підключення з Atlas, `FRONTEND_DOMAIN` — URL
   задеплоєного фронтенду з `NoteHub_Front_End`).
4. Після деплою бекенд буде доступний на `https://<service>.onrender.com` —
   цей URL і треба вказати фронтенду в `NEXT_PUBLIC_API_URL`.

### Безпека ключів/секретів

- Жодне значення з `.env` не комітиться в git (правило в `.gitignore`).
- На Render секрети додаються через вкладку **Environment** сервісу — вони
  шифруються і не потрапляють у публічний код чи логи збірки.
- Якщо колись випадково закомітив `.env` із реальними секретами — потрібно
  негайно змінити (ротувати) ці значення, а не лише видалити файл, бо стара
  версія залишиться в історії git.
