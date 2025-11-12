# Todo приложение

Веб-приложение для управления задачами на Go + React.

## Требования

- Go 1.21+
- Node.js 18+
- npm

## Быстрый запуск

### Linux/macOS

Запустите проект одной командой:

```bash
./scripts/start.sh
```

### Windows

**PowerShell:**
```powershell
.\scripts\start.ps1
```

**Git Bash или WSL:**
```bash
bash scripts/start.sh
```

**Или запустите вручную:**

**Backend:**
```bash
cd server
go run main.go
```

**Frontend (в новом терминале):**
```bash
cd client
npm install
npm run dev
```

## Переменные окружения

Создайте файл `.env` в корне проекта (опционально):

```env
PORT=8080
DATABASE_PATH=todo.db
JWT_SECRET=your_secret_key_here
ALLOW_ORIGIN=http://localhost:3000
VITE_API_URL=http://localhost:8080
```

По умолчанию используются значения:
- `PORT=8080`
- `DATABASE_PATH=todo.db`
- `JWT_SECRET=dev_secret_change_me`
- `ALLOW_ORIGIN=http://localhost:3000`
- `VITE_API_URL=http://localhost:8080`

## Доступ

После запуска приложение будет доступно по адресам:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080

## Структура проекта

```
todo-go/
├── client/          # React frontend
├── server/          # Go backend
├── scripts/         # Вспомогательные скрипты
└── docs/            # Собранный frontend для GitHub Pages
```

