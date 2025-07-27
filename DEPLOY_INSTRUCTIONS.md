# Инструкции по деплою на Netlify

## Автоматический деплой

1. **Подключите проект к Netlify:**
   - Зайдите на [netlify.com](https://netlify.com)
   - Нажмите "New site from Git"
   - Выберите ваш Git репозиторий

2. **Настройки сборки в Netlify:**
   ```
   Build command: npm run build
   Publish directory: dist/public
   ```

3. **Переменные окружения (если нужны):**
   - Добавьте в Site settings → Environment variables

## Ручной деплой

1. **Соберите проект:**
   ```bash
   npm run build
   ```

2. **Загрузите папку на Netlify:**
   - Перетащите папку `dist/public` на сайт [netlify.com/drop](https://netlify.com/drop)
   - Или используйте Netlify CLI:
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist/public
   ```

## Локальная проверка

Чтобы проверить сборку локально:

```bash
# Соберите проект
npm run build

# Запустите локальный веб-сервер в папке dist/public
cd dist/public
python -m http.server 8000
# или
npx serve .
```

Затем откройте http://localhost:8000

## Файлы для деплоя

✅ `dist/public/` - содержит все необходимые файлы:
- `index.html` - главная страница игры
- `assets/` - CSS, JS и аудио файлы
- `_redirects` - для правильной маршрутизации на Netlify

## Решение проблем

- Если игра не загружается, проверьте Console в браузере
- Убедитесь, что все пути к ресурсам корректны
- Проверьте, что аудио файлы загружаются (могут быть заблокированы autoplay политикой)

## Альтернативные платформы

Ваша игра также может быть задеплоена на:
- Vercel
- GitHub Pages  
- Firebase Hosting
- Surge.sh

Все эти платформы работают со статическими файлами из папки `dist/public`.