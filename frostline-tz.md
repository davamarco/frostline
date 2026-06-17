# ТЗ — Сайт «Frostline Resort»

> Это техзадание для сборки сайта в Claude Code (VS Code).
> **Тексты на самом сайте — на английском** (они уже готовы ниже, переводить ничего не нужно).
> Пояснения и инструкции — на русском.
> Стек: чистый **HTML + CSS + JavaScript**, без фреймворков и без сборки. Хостинг — GitHub Pages.

---

## 1. О проекте (вымышленные данные)

- **Название:** Frostline Resort
- **Что это:** курорт катания на сноуборде в горах Колорадо
- **Адрес:** 4200 Powder Ridge Road, Silver Hollow, CO 81224
- **Телефон:** (970) 555-0148
- **Email:** hello@frostlineresort.com
- **Часы работы:** Mon–Sun, 8:00 AM – 4:30 PM (lifts) · Lodge until 9:00 PM
- **Соцсети (заглушки, ставить `#`):** Instagram, YouTube, Facebook

Всё вымышленное — это портфолио-проект, не реальная компания.

---

## 2. Технические правила (важно сказать Claude Code)

- Только **HTML5 + CSS3 + ванильный JS**. Никакого React, Vue, Tailwind, сборщиков, npm.
- Многостраничный сайт: **4 отдельные HTML-страницы** с общим меню и подвалом.
- **Относительные пути** ко всем файлам (без `/` в начале), чтобы работало в подпапке на GitHub Pages (например `davamarco.github.io/frostline/`).
- Адаптивность: корректно на телефоне, планшете и десктопе.
- Доступность: альты у картинок, контраст текста, поддержка `prefers-reduced-motion` (если у пользователя выключены анимации — отключаем).
- Один общий `style.css` и один общий `script.js` на все страницы.

---

## 3. Структура папок и файлов

```
frostline/
├── index.html          (Home)
├── pricing.html        (Pricing)
├── gallery.html        (Gallery)
├── contact.html        (Contact)
├── css/
│   └── style.css
├── js/
│   └── script.js
└── assets/
    ├── video/
    │   └── hero.mp4
    └── img/
        ├── hero-poster.jpg
        ├── activity-freeride.jpg
        ├── activity-lessons.jpg
        ├── activity-rentals.jpg
        ├── activity-park.jpg
        ├── gallery-01.jpg ... gallery-10.jpg
        ├── cta-banner.jpg
        ├── pricing-banner.jpg
        └── contact-map.jpg
```

---

## 4. Дизайн-система

### Шрифты (Google Fonts)
- **Заголовки:** Anton — всегда КАПСОМ (`text-transform: uppercase`), `letter-spacing: -0.01em`, `line-height: 0.95`.
- **Текст:** Manrope (weights 400, 500, 700).

Подключение в `<head>` каждой страницы:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Manrope:wght@400;500;700&display=swap" rel="stylesheet">
```

### Цвета (задать как CSS-переменные)
```css
:root{
  --white:   #FFFFFF;
  --lime:    #A3E635;   /* салатовый — основной акцент, фон кнопок */
  --lime-deep:#6FA01E;  /* для hover-состояния кнопок */
  --lemon:   #FDE047;   /* лимонный — второй акцент: бейджи, подчёркивания, мелкие детали */
  --ink:     #0E120A;   /* почти чёрный — текст и тёмные секции */
  --ink-soft:#3A3F33;   /* приглушённый тёмный для подзаголовков */
  --gray-bg: #F4F5F0;   /* очень светлый фон для чередования секций */
}
```

### Кнопки
- Фон `--lime`, **текст чёрный** (`--ink`), капсом, скруглённые (`border-radius: 999px`), padding ~`14px 28px`.
- Hover: фон `--lime-deep`, лёгкий подъём (`transform: translateY(-2px)`), плавный переход `0.2s`.

### Общая стилистика
- Основной фон сайта — **белый**, секции чередуются: white → `--gray-bg` → white.
- Тёмные секции (`--ink`) используем точечно для контраста (hero overlay, CTA-баннер, подвал).
- Скругления карточек: `16px`. Тени мягкие, едва заметные.
- Лимонный — только акцентами (тонкая линия под заголовком, маленький бейдж «NEW», номер шага). Не заливать им большие площади.

---

## 5. Общие элементы (на всех 4 страницах)

### Шапка / навигация
- **Sticky** сверху, «плавающая»: полупрозрачный белый фон с лёгким блюром (`backdrop-filter: blur`).
- Слева логотип-текст **FROSTLINE** (Anton, капс). Можно добавить маленький SVG-значок снежинки/горы слева от текста.
- По центру/справа меню: `HOME · PRICING · GALLERY · CONTACT`.
- Справа салатовая кнопка `BOOK NOW`.
- Активная страница в меню подчёркнута лимонной линией.
- На скролле шапка чуть уменьшается по высоте и тень становится заметнее.
- **Мобильное меню:** бургер-иконка справа, по тапу выезжает меню.

### Подвал (footer, тёмный `--ink`)
Три колонки:
1. **FROSTLINE RESORT** + короткий слоган: *"Pure Colorado powder, since 1998."*
2. **Visit** — адрес, телефон, email, часы работы.
3. **Follow** — ссылки на соцсети (заглушки).
Снизу строка: `© 2026 Frostline Resort. All rights reserved.`

---

## 6. Страница HOME (`index.html`)

**Секция 1 — HERO (на весь экран, видео-фон)**
- `<video>` на весь экран: `autoplay muted loop playsinline`, `object-fit: cover`, атрибут `poster="assets/img/hero-poster.jpg"`.
- Поверх видео — тёмный полупрозрачный overlay (`rgba(14,18,10,0.45)`), чтобы текст читался.
- Контент поверх:
  - Заголовок (Anton, очень крупный): **RIDE THE FROSTLINE**
  - Подзаголовок (Manrope): *Snowboarding in the heart of the Colorado Rockies.*
  - Кнопка: **BOOK YOUR SESSION**
- Анимация: при загрузке слова заголовка появляются «лесенкой» (staggered fade-up).

**Секция 2 — INTRO (белый фон)**
- Маленький лимонный лейбл сверху: *WELCOME*
- Заголовок: **WHERE THE POWDER RUNS DEEP**
- Абзац (Manrope): *Tucked into Colorado's Gunnison Valley, Frostline is built for riders who live for fresh lines and steep descents. Fifteen trails, four lifts, and some of the deepest snow in the Rockies.*

**Секция 3 — ACTIVITIES (фон `--gray-bg`, 4 карточки)**
Заголовок секции: **WHAT YOU CAN DO**
Карточки (вертикальное фото сверху, заголовок, короткий текст):
1. **FREERIDE TERRAIN** — *Open bowls and tree runs for every level.* (`activity-freeride.jpg`)
2. **LESSONS** — *Learn fast with certified local instructors.* (`activity-lessons.jpg`)
3. **RENTALS** — *Premium boards and gear, ready to ride.* (`activity-rentals.jpg`)
4. **SNOW PARK** — *Kickers, rails and a halfpipe for the bold.* (`activity-park.jpg`)
- Hover: карточка слегка приподнимается, фото чуть зумится.

**Секция 4 — STATS (тёмный фон `--ink`, анимированные счётчики)**
4 числа, которые «докручиваются» от 0 при появлении в зоне видимости:
- **15** Trails
- **320cm** Annual Snowfall
- **4** Lifts
- **12** Pro Instructors

**Секция 5 — GALLERY TEASER (белый фон)**
- Заголовок: **LIFE ON THE MOUNTAIN**
- 3–4 фото из галереи в ряд.
- Кнопка: **VIEW GALLERY** → ведёт на `gallery.html`.

**Секция 6 — CTA BANNER (фоновое фото `cta-banner.jpg` + тёмный overlay)**
- Заголовок: **READY TO DROP IN?**
- Кнопка: **BOOK YOUR SESSION**

Дальше — общий подвал.

---

## 7. Страница PRICING (`pricing.html`)

**Шапка-баннер** (фото `pricing-banner.jpg` + overlay): заголовок **PRICING**, подзаголовок *Simple rates. No hidden fees.*

**Блок 1 — LIFT PASSES** (3 карточки цен):
- **DAY PASS** — $89 / day — *Full access to all lifts and trails.*
- **3-DAY PASS** — $239 — *Save 10% over single days.* (бейдж лимонный **POPULAR**)
- **SEASON PASS** — $749 — *Unlimited riding, all season long.*

**Блок 2 — LESSONS** (3 карточки):
- **GROUP LESSON** — $59 / 2 hrs — *Small groups, all levels.*
- **PRIVATE LESSON** — $129 / 2 hrs — *One-on-one with a pro.*
- **KIDS CAMP** — $99 / day — *Ages 6–12, full-day program.*

**Блок 3 — RENTALS** (3 карточки):
- **BOARD + BOOTS** — $45 / day
- **FULL KIT** — $65 / day — *Board, boots, helmet, goggles.*
- **HELMET ONLY** — $15 / day

Внизу мелким шрифтом: *All prices in USD. Rates shown are for demonstration purposes.*
- Карточка с бейджем **POPULAR** выделена салатовой рамкой.

---

## 8. Страница GALLERY (`gallery.html`)

- Заголовок: **THE GALLERY**, подзаголовок *Powder days, big lines, and mountain life.*
- Сетка из 10 фото (`gallery-01..10.jpg`), смесь широких и вертикальных — раскладка типа masonry/CSS grid.
- Анимация: фото появляются по мере прокрутки (fade-up, с лёгкой задержкой друг за другом).
- Hover: лёгкий зум фото + затемнение, можно показать короткую подпись.
- (Опционально, если просто) клик по фото открывает его крупно — простой lightbox на ванильном JS. Если усложняет — пропустить.

Фото включают: сноубордисты в прыжке, панорамы гор, деревянный лодж, подъёмник, кафе с панорамным окном, крупный план снега, закат над склонами.

---

## 9. Страница CONTACT (`contact.html`)

- Заголовок: **GET IN TOUCH**
- **Формы заявок НЕ делать** (по решению заказчика).
- Две колонки:
  - **Слева — инфо:** адрес, телефон, email, часы работы, соцсети. Каждый пункт с маленькой иконкой (можно простые inline-SVG).
  - **Справа — «карта»:** картинка `contact-map.jpg` (стилизованная иллюстрация-карта местности) со скруглением. **Не Google Maps.**
- Под блоком — короткая строка: *Walk-ins welcome. Reservations recommended on weekends.*

---

## 10. Анимации (ванильный JS + CSS)

- **Scroll reveal:** через `IntersectionObserver` — элементы получают класс `.visible` при появлении (fade + сдвиг вверх). Это главный приём, применить к большинству секций.
- **Hero:** staggered-появление заголовка при загрузке; лёгкий параллакс/зум видео по желанию.
- **Счётчики** в блоке Stats: анимация чисел от 0 до значения при первом появлении.
- **Hover:** карточки приподнимаются, фото зумятся, кнопки меняют цвет/поднимаются.
- **Навигация:** уменьшение шапки на скролле.
- Обязательно: если включён `prefers-reduced-motion: reduce` — все анимации отключаются.

---

## 11. Картинки и видео — что генерировать

**Принцип:** точные пиксели не важны (в коде `object-fit: cover`), важна **ориентация** и хорошее разрешение. После генерации сжать всё через **squoosh.app** или **tinypng.com** (каждый файл < 300–500 КБ), иначе сайт будет тормозить.

**Видео (делаешь сам):**
- `hero.mp4` — горизонтальное 1920×1080, 10–20 сек, зацикленное, < ~15 МБ.
- `hero-poster.jpg` — один кадр из видео, 1920×1080.

**Фото (генеришь в ChatGPT).** В конце КАЖДОГО промта добавляй один и тот же «хвост стиля» для единообразия:
> `cinematic professional snowboarding photography, bright daylight, fresh white powder snow, blue sky, vibrant and crisp, high detail, no text, no logos`

| Файл | Ориентация | Что на фото (начало промта) |
|---|---|---|
| `activity-freeride.jpg` | вертикальная | snowboarder carving down a steep powder slope, spraying snow, dynamic action |
| `activity-lessons.jpg` | вертикальная | snowboard instructor teaching a beginner on a gentle slope |
| `activity-rentals.jpg` | вертикальная | rack of snowboards and boots in a rental shop, clean and modern |
| `activity-park.jpg` | вертикальная | snowboarder jumping off a kicker in a snow park, mid-air |
| `gallery-01.jpg` | широкая | wide panorama of snowy mountain peaks under blue sky |
| `gallery-02.jpg` | вертикальная | snowboarder mid-jump with snow spray, golden hour |
| `gallery-03.jpg` | широкая | cozy wooden ski lodge exterior with snow on the roof, warm lights |
| `gallery-04.jpg` | широкая | mountain chairlift over a snowy slope |
| `gallery-05.jpg` | вертикальная | close-up of a snowboard edge cutting through fresh snow |
| `gallery-06.jpg` | широкая | cafe interior with panoramic window facing snowy mountains |
| `gallery-07.jpg` | вертикальная | snowboarder riding through a forest tree run |
| `gallery-08.jpg` | широкая | sunset over snowy ski slopes, warm orange light |
| `gallery-09.jpg` | вертикальная | group of friends with snowboards smiling at the top of a slope |
| `gallery-10.jpg` | широкая | aerial view of ski trails carved into a mountain |
| `cta-banner.jpg` | широкая | epic steep snowboarding slope viewed from above, dramatic |
| `pricing-banner.jpg` | широкая | snowy mountain ridge line, clean and wide |
| `contact-map.jpg` | широкая | stylized illustrated trail map of a mountain ski resort, flat design |

> Примечание: для `contact-map.jpg` хвост стиля можно НЕ добавлять — это иллюстрация-карта, а не фото.

---

## 12. Производительность

- Все картинки сжать (см. выше).
- У всех `<img>` кроме hero добавить `loading="lazy"`.
- Видео — только в hero, обязательно с `poster`.
- Указать `width`/`height` или `aspect-ratio`, чтобы не «прыгала» вёрстка при загрузке.

---

## 13. Порядок сборки в Claude Code (по шагам)

Не проси всё сразу — собирай по частям и проверяй в браузере после каждого шага.

1. **Каркас проекта:** создать структуру папок и пустые файлы (раздел 3).
2. **Дизайн-система:** в `style.css` прописать CSS-переменные, шрифты, базовые стили, стиль кнопок (раздел 4).
3. **Шапка + подвал:** сверстать общие шапку и подвал, вставить их одинаково на все 4 страницы (раздел 5).
4. **Home:** собрать по секциям сверху вниз (раздел 6). Hero — первым.
5. **Pricing** (раздел 7).
6. **Gallery** (раздел 8).
7. **Contact** (раздел 9).
8. **Анимации:** `script.js` — scroll reveal, счётчики, мобильное меню (раздел 10).
9. **Адаптив:** пройтись по брейкпоинтам (телефон/планшет/десктоп), починить мелочи.
10. **Подстановка ассетов:** положить реальные фото/видео в `assets/`, заменить заглушки.

> Совет: в Claude Code держи **Auto mode (Shift+Tab)**, чтобы не подтверждать каждое действие.
> Пока ассетов нет — пусть Claude Code ставит цветные блоки-заглушки нужной пропорции, чтобы сразу видеть раскладку.

---

## 14. Публикация на GitHub Pages

1. Создать репозиторий (например `frostline`).
2. Залить все файлы.
3. Settings → Pages → Source: ветка `main`, папка `/root`.
4. Проверить, что сайт открывается по адресу `имя.github.io/frostline/`.
5. Прокликать все 4 страницы и проверить, что картинки и ссылки работают (из-за относительных путей).

---

*Конец ТЗ.*
