server-architecture:

server/
│── node_modules/              # Папка залежностей
│── controllers/               # CRUD-логіка для кожної таблиці
│   ├── generaldataController.js
│   ├── programsController.js
│   ├── programFilesController.js
│   ├── certificatesController.js  # Генерація сертифікатів
│── models/                    # Моделі бази даних
│   ├── db.js                   # Підключення до MySQL
│── routes/                    # Маршрути API
│   ├── generaldataRoutes.js
│   ├── programsRoutes.js
│   ├── programFilesRoutes.js
│   ├── certificatesRoutes.js
│── uploads/                   # Папка для тимчасового зберігання файлів
│── generated_certificates/    # Папка для збереження згенерованих сертифікатів
│── app.js                     # Головний файл сервера
│── package.json               # Файл залежностей Node.js
│── package-lock.json          # Автоматично згенерований файл
