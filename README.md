# YeaHub Practice

Учебная платформа для подготовки к IT-собеседованиям. Проект создан с нуля по техническому заданию YeaHub и работает с публичным API `https://api.yeatwork.ru`.

## Возможности

- адаптивный лендинг, база вопросов и тренажёр;
- регистрация и вход через API, хранение и автоматическая передача JWT;
- защищённые маршруты и выход при ответе API `401`/истечении токена;
- дашборд и редактирование профиля, выбор специализации и навыков;
- загрузка и предпросмотр аватара (до 2 МБ);
- админский CRUD специализаций и навыков с подтверждением удаления;
- UI Kit (`Button`, `Input`, `Card`, `Modal`, `Skeleton`) со Storybook;
- unit-тесты, ESLint, Prettier, Husky и lint-staged;
- production-сборка Webpack, Docker/Nginx и GitHub Actions.

## Стек

React, TypeScript, Redux Toolkit, RTK Query, React Router, Webpack, Vitest, Testing Library, Storybook, Docker.

## Архитектура

Исходники организованы по Feature-Sliced Design. Каждый слайс имеет публичный API в `index.ts`; межслайсовые импорты не обращаются к внутренним сегментам напрямую.

```text
src/
├── app/       # инициализация, store, router, providers, глобальные стили
├── pages/     # landing, auth, dashboard, profile, admin, questions, trainer
├── widgets/   # композиционные блоки страницы (layout)
├── features/  # пользовательские сценарии (auth)
├── entities/  # user, catalog и question: модели и RTK Query endpoints
└── shared/    # UI Kit, base API, утилиты и тестовая конфигурация
```

Зависимости направлены сверху вниз: `app → pages → widgets → features → entities → shared`.

## Локальный запуск

Требуется Node.js 20+.

```bash
npm install
cp .env.example .env
npm start
```

Приложение будет доступно на [http://localhost:3000](http://localhost:3000). Этот порт закреплён в Webpack-конфигурации из-за политики CORS API.

Переменная окружения:

```dotenv
API_URL=https://api.yeatwork.ru
```

## Проверки

```bash
npm run typecheck
npm run lint
npm run format:check
npm test
npm run build
npm run storybook
```

Storybook запускается на `http://localhost:6006`.

## Docker

```bash
docker build --build-arg API_URL=https://api.yeatwork.ru -t yeahub-practice .
docker run --rm -p 3000:80 yeahub-practice
```

## Роль администратора

Маршрут `/admin` доступен только при наличии роли `admin` в `userRoles`. Роль назначается на стороне API — перед проверкой админки её необходимо запросить у ментора, как указано в задании.

## API и безопасность

RTK Query автоматически добавляет `Authorization: Bearer <access_token>` к запросам. Токен проверяется по полю `exp`; просроченная сессия удаляется из `localStorage`, а защищённый маршрут перенаправляет на `/login`. Ответ `401` также завершает локальную сессию.

Основные использованные методы:

- `POST /auth/login`, `POST /auth/signUp`, `GET /auth/profile`;
- `PATCH /users/{id}`, `PUT /profiles/{id}`;
- CRUD `/specializations` и `/skills`;
- `GET /questions/public-questions`.

## Деплой

Workflow `.github/workflows/ci.yml` выполняет линтинг, проверку типов, тесты, сборку приложения, Storybook и Docker-образ. Для автоматического деплоя на конкретный VPS добавьте в GitHub Secrets адрес, SSH-пользователя и ключ, затем отдельный deploy job под инфраструктуру сервера.

Ссылка на production: _добавьте после выдачи VPS и домена_.
