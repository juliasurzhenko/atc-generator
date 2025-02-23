atc-admin/
│── src/
│   ├── assets/               # Статичні файли (іконки, зображення)
│   ├── components/           # UI-компоненти
│   │   ├── Sidebar.tsx       # Бокове меню
│   │   ├── Navbar.tsx        # Верхня панель
│   │   ├── ProtectedRoute.tsx # Захист маршрутів авторизацією
│   ├── pages/                # Сторінки
│   │   ├── Login.tsx         # Сторінка входу
│   │   ├── Users.tsx         # Користувачі
│   │   ├── Programs.tsx      # Програми
│   │   ├── Participants.tsx  # Дані учасників
│   ├── services/             # API-запити
│   │   ├── authService.ts    # Авторизація
│   │   ├── userService.ts    # Користувачі
│   │   ├── programService.ts # Програми
│   ├── context/              # Глобальні стани
│   │   ├── AuthContext.tsx    # Контекст авторизації
│   ├── App.tsx               # Головний компонент
│   ├── main.tsx              # Точка входу
│── public/                   # Публічні файли
│── .env                      # Змінні середовища
│── package.json              # Конфігурація npm
│── tsconfig.json             # Конфігурація TypeScript
│── vite.config.ts            # Конфігурація Vite
