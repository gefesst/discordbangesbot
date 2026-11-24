# discordbangesbot

Discord-бот на **Node.js / TypeScript (discord.js)**, который по запросу показывает **публичные бейджи профиля** пользователя (`public_flags`), кратко объясняет значение каждого и — где это честно известно из публичных правил Discord — что нужно, чтобы получить или улучшить бейдж.

> **Важно:** Discord **не отдаёт ботам** полный список «красивых» бейджей из клиента (Nitro, месяцы буста, квесты и т.д.). Бот показывает только то, что реально доступно через API, и явно пишет про пробелы.

---

## Features / Возможности

| Slash-команда | Описание |
| --- | --- |
| `/badges [user]` | Бейджи свои или упомянутого пользователя: имя, смысл, статус/уровень (если применимо), что известно про получение/апгрейд |
| `/badges-info` | Каталог известных `public_flags` + честный список того, чего API не даёт |
| `/help` | Краткая справка |

Дополнительно (если команда вызвана **на сервере** и включён интент Members): дата буста **этого** сервера (`GuildMember.premium_since`).

---

## What the API can and cannot show / Что реально видно

### Доступно через Bot API (`User.public_flags` / `user.flags`)

| Flag | Бейдж |
| --- | --- |
| `Staff` | Discord Employee |
| `Partner` | Partnered Server Owner |
| `Hypesquad` | HypeSquad Events |
| `BugHunterLevel1` / `BugHunterLevel2` | Bug Hunter L1 / L2 |
| `HypeSquadOnlineHouse1/2/3` | Bravery / Brilliance / Balance |
| `PremiumEarlySupporter` | Early Supporter |
| `VerifiedBot` | Verified Bot |
| `VerifiedDeveloper` | Early Verified Bot Developer |
| `CertifiedModerator` | Moderator Programs Alumni |
| `ActiveDeveloper` | Active Developer (`1 << 22`) |
| `TeamPseudoUser`, `BotHTTPInteractions` | служебные флаги (не «прокачиваемые» бейджи) |

**Прогресс:** почти все флаги **бинарные**. Для Bug Hunter API знает только L1 vs L2 — **не** число отчётов. Срок Active Developer боту **не** виден.

### Доступно в контексте сервера

- `premium_since` — с какой даты пользователь бустит **текущий** сервер (нужен privileged intent **Server Members**).

### Недоступно боту для произвольных пользователей

- Тип **Nitro** (`premium_type`) — только OAuth2 `@me` со scope `identify` / `identify.premium`
- Глобальный бейдж **месяцев буста** (1–24)
- Бейджи **квестов**, Orbs, Legacy Username, большинство ивентовых значков
- Заявки Partner / Bug Bounty / Moderator Programs и любой скрытый прогресс

Бот **не выдумывает** критерии разблокировки, если Discord их не документирует публично.

---

## Setup / Установка

### 1. Требования

- Node.js **20+**
- Приложение Discord в [Developer Portal](https://discord.com/developers/applications)

### 2. Discord Developer Portal

1. **New Application** → задайте имя.
2. Вкладка **Bot** → **Add Bot** → **Reset Token** → скопируйте токен → `DISCORD_TOKEN`.
3. Вкладка **General Information** → скопируйте **Application ID** → `CLIENT_ID`.
4. **Privileged Gateway Intents** (вкладка Bot):
   - Включите **Server Members Intent** — нужен для `GuildMember` / даты буста на сервере.
   - **Message Content Intent** этому боту **не** нужен (только slash-команды).
5. **OAuth2 → URL Generator**:
   - Scopes: `bot`, `applications.commands`
   - Bot Permissions: минимум `View Channels` + `Send Messages` + `Embed Links`  
     (для slash-ответов обычно достаточно; при желании добавьте `Use Application Commands`).
6. Откройте сгенерированную invite-ссылку и добавьте бота на сервер.

Пример invite (подставьте `CLIENT_ID`):

```text
https://discord.com/api/oauth2/authorize?client_id=CLIENT_ID&permissions=2048&scope=bot%20applications.commands
```

(`permissions=2048` = Send Messages; при необходимости пересчитайте в URL Generator.)

### 3. Локальный запуск

```bash
git clone https://github.com/gefesst/discordbangesbot.git
cd discordbangesbot
cp .env.example .env
# заполните DISCORD_TOKEN и CLIENT_ID; опционально GUILD_ID для мгновенных guild-команд
npm install
npm run dev          # разработка (tsx watch)
# или
npm run build && npm start
```

Одноразовая регистрация команд без запуска gateway:

```bash
npm run register-commands
```

### Переменные окружения

| Переменная | Обязательно | Описание |
| --- | --- | --- |
| `DISCORD_TOKEN` | да | Токен бота |
| `CLIENT_ID` | да | Application (Client) ID |
| `GUILD_ID` | нет | Если задан — команды регистрируются только в этой гильдии (сразу). Иначе — глобально (до ~1 часа) |

---

## Scripts

| Script | Действие |
| --- | --- |
| `npm run dev` | Запуск с hot-reload (`tsx watch`) |
| `npm start` | Запуск собранного `dist/` (`node dist/index.js`) |
| `npm run build` | Компиляция TypeScript |
| `npm run typecheck` | Проверка типов без emit |
| `npm run register-commands` | Только регистрация slash-команд |

---

## Project layout

```text
src/
  index.ts                 # вход: клиент, intents, обработка команд
  register-commands.ts     # one-shot регистрация
  config.ts                # env
  commands/                # slash-команды
  badges/                  # каталог флагов + инспекция
  utils/embeds.ts          # Embed-ответы (RU)
```

---

## Honesty policy / Честность данных

1. Источник истины для «есть бейдж / нет» — **`public_flags`** из Discord API.
2. Тексты «как получить» — из **публичных** программ Discord (Partner, Bug Hunter, Active Developer и т.д.), не из приватных эндпоинтов.
3. Если прогресс неизвестен — бот так и пишет, а не подставляет выдуманные числа.

---

## License

MIT (или уточните у владельца репозитория).
