# nodejs-hw — Express Notes API

Мінімальний Express-сервер для роботи з колекцією нотаток (поки без бази даних).

## Маршрути

| Метод | Шлях             | Відповідь                                                  |
| ----- | ---------------- | ----------------------------------------------------------- |
| GET   | `/notes`         | `200` `{ "message": "Retrieved all notes" }`                |
| GET   | `/notes/:noteId` | `200` `{ "message": "Retrieved note with ID: <noteId>" }`   |
| GET   | `/test-error`    | `500` `{ "message": "Simulated server error" }`              |
| *     | будь-що інше     | `404` `{ "message": "Route not found" }`                    |

## Стек

Express 5, cors, dotenv, pino-http (+ pino-pretty), ESLint (flat config), Prettier, nodemon.

## Локальний запуск

```bash
npm install
cp .env.example .env   # за потреби зміни PORT
npm run dev             # розробка з nodemon
# або
npm start                # production-режим
```

Сервер піднімається на `http://localhost:3000` (або на порту зі `.env`).

## Структура проєкту

```
nodejs-hw/
├─ src/
│  └─ server.js
├─ .editorconfig
├─ .env            # НЕ комітиться (див. .gitignore)
├─ .env.example    # шаблон без секретів
├─ .gitignore
├─ .prettierrc
├─ eslint.config.mjs
├─ package.json
└─ README.md
```

---

## Покрокова інструкція: від репозиторію до деплою

### 1. Git та GitHub

```bash
cd nodejs-hw
git init
git add .
git commit -m "Initial commit: express setup"

# створи репозиторій на GitHub з назвою nodejs-hw (через сайт або gh cli)
gh repo create nodejs-hw --public --source=. --remote=origin
# або вручну: створи репо на github.com, потім:
git remote add origin https://github.com/<твій-нікнейм>/nodejs-hw.git

git branch -M main
git push -u origin main
```

### 2. Гілка завдання

```bash
git checkout -b 01-express
git push -u origin 01-express
```

Посилання на код для здачі буде такого формату:
`https://github.com/<твій-нікнейм>/nodejs-hw/tree/01-express`

### 3. Перевір, що секрети не потраплять у git

`.env` вже додано до `.gitignore`. Перевір:

```bash
git status        # .env НЕ повинен з'являтися у списку
git check-ignore -v .env   # має показати правило з .gitignore
```

У репозиторій комітиться лише `.env.example` (без реальних значень) — це орієнтир для інших розробників, які змінні треба створити.

### 4. Деплой на Render.com

1. Зайди на [render.com](https://render.com) → **New** → **Web Service**.
2. Підключи свій GitHub-репозиторій `nodejs-hw`.
3. У полі **Branch** обери `01-express` (саме цю гілку, не `main`).
4. Налаштування білда:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node
5. Розділ **Environment Variables** (тут ключі зберігаються приховано, у git вони не світяться):
   - `PORT` — Render сам підставляє свій порт через змінну `PORT`, тож можеш або не задавати її взагалі (сервіс Render сам прокидає `PORT`), або вказати своє значення — код вже читає `process.env.PORT || 3000`, тож працюватиме в обох випадках.
6. Натисни **Create Web Service** і дочекайся завершення деплою.
7. Після деплою Render видасть публічний URL типу `https://nodejs-hw-xxxx.onrender.com`.

### 5. Перевірка задеплоєного сервісу

```bash
curl https://nodejs-hw-xxxx.onrender.com/notes
curl https://nodejs-hw-xxxx.onrender.com/notes/123
curl https://nodejs-hw-xxxx.onrender.com/unknown-route
curl https://nodejs-hw-xxxx.onrender.com/test-error
```

Перевір, що всі статуси та тіла відповідей збігаються з вимогами завдання.

### 6. Перед здачею

- Зачекай ~5 хвилин після останнього пушу — GitHub/Render потребують час, щоб підхопити оновлення.
- Переконайся, що гілка `main` не видалена і не перейменована.
- Зберіть фінальні посилання:
  - Код: `https://github.com/<твій-нікнейм>/nodejs-hw/tree/01-express`
  - Деплой: `https://nodejs-hw-xxxx.onrender.com`

## Безпека ключів/секретів

- Жодне значення з `.env` не комітиться в git (правило в `.gitignore`).
- На Render секрети додаються через вкладку **Environment** сервісу — вони шифруються і не потрапляють у публічний код чи логи збірки.
- Якщо колись випадково закомітив `.env` із реальними секретами — потрібно негайно змінити (ротувати) ці значення, а не лише видалити файл, бо стара версія залишиться в історії git.
