# 🏆 Certificate Generator System

Система для автоматизованої генерації сертифікатів на основі Excel-таблиць з учасниками та Word-файлів із програмами.

---

## 🔗 Зміст

- [Опис](#опис)
- [Технології](#технології)
- [Архітектура проєкту](#архітектура-проєкту)
- [Структура бази даних](#структура-бази-даних)
- [Встановлення](#встановлення)
- [Використання](#використання)
- [Безпека](#безпека)
- [Розгортання](#розгортання)
- [Контакти](#контакти)

---

## 📄 Опис

Цей веб-додаток дозволяє адміністраторам завантажити список учасників (Excel), обрати програму (Word), автоматично сформувати сертифікати та зберегти їх у зручному форматі (PDF / ZIP).

---

## ⚙️ Технології

**Frontend:**
- React, TypeScript
- Vite
- Ant Design

**Backend:**
- Node.js + Express.js
- Multer (завантаження файлів)
- JWT (авторизація)
- mysql2 (підключення до MySQL)
- docx / pdf-lib (генерація сертифікатів)

**Інше:**
- MySQL (зберігання даних)
- JSZip (архівація)

---

## 🏗 Архітектура проєкту

Система розділена на три компоненти:

### 1. 🖥️ Frontend (React + TypeScript)
- Адмін-панель із можливістю:
  - Авторизації
  - Завантаження файлів
  - Перегляду учасників та сертифікатів
- Структура:
/src
├── components/
├── pages/
├── routes/
├── services/
└── hooks/

markdown
Копіювати
Редагувати

### 2. 🔧 Backend (Express.js + MySQL)
- REST API для:
- Авторизації
- CRUD операцій з таблицями
- Генерації сертифікатів
- Структура:
/server
├── routes/
├── controllers/
├── services/
├── middlewares/
└── uploads/

less
Копіювати
Редагувати

### 3. 🗃️ База Даних (MySQL)
- Таблиці: `users`, `programs`, `generaldata`, `program_files`, `certificates`

### 🔄 Взаємодія компонентів

```mermaid
graph TD
A[Frontend (React)] -->|HTTP| B[Backend (Express)]
B -->|SQL| C[(MySQL)]
B --> D[Генерація PDF / DOCX]
D --> E[ZIP-архів]
E --> A
🧱 Структура бази даних
users
id, email, password_hash, role

generaldata
id, title, template_filedata, participants_filedata

programs
id, program_name, description

program_files
id, program_id, filedata, parsed_text

certificates
id, user_id, program_id, filename, generated_at

🚀 Встановлення
1. Клонувати репозиторій

git clone https://github.com/your-username/certificate-generator.git
cd certificate-generator

2. Налаштувати .env
Backend (server/.env)

PORT=5000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=generator
DB_USER=root
DB_PASSWORD=qwerty123
JWT_SECRET=your_jwt_secret

3. Встановити залежності
Backend:

cd server
npm install
node app.js

Frontend:

cd client
npm install
npm run dev

📦 Використання
Залогінитись як адміністратор

Завантажити Excel-файл з учасниками

Завантажити шаблон сертифіката (Word)

Вибрати програму

Натиснути "Генерувати сертифікати"

Завантажити ZIP-файл з готовими PDF-документами

🔐 Безпека
Всі маршрути API захищені JWT-токенами.

Обробка файлів — з перевіркою MIME-типів і розміру.

Паролі зберігаються з хешуванням (bcrypt).

Input-валідація на бекенді та фронтенді.

📬 Контакти
Автор: Surzhenko Yuliia
Email: surzhenkoyulia@gmail.com
GitHub: https://github.com/juliasurzhenko

