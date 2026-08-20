# YeaHub Practice

Учебная платформа для подготовки к IT-собеседованиям. Проект создан с нуля по техническому заданию YeaHub и работает с публичным API `https://api.yeatwork.ru`.

## Деплой

Workflow `.github/workflows/ci.yml` выполняет линтинг, проверку типов, тесты, сборку приложения, Storybook и Docker-образ.
Workflow `.github/workflows/deployBranch.yml` создаёт production-сборку в `dist` и публикует этот артефакт в GitHub Pages.

Ссылка на GitHub Pages: [https://shavelmaxim.github.io/app_yeahub/](https://shavelmaxim.github.io/app_yeahub/)

## Стек

React, TypeScript, Redux Toolkit, RTK Query, React Router, Webpack, Vitest, Testing Library, Storybook, Docker.

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
