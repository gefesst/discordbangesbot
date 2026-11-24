import { UserFlags } from 'discord.js';

/**
 * Catalog of badges that Discord exposes (or used to expose) via public_flags.
 * Descriptions and unlock notes are based on public Discord docs / known programs —
 * not on private API fields. Where Discord does not publish remaining progress
 * (e.g. bug reports left until Level 2), we say so explicitly.
 */
export type BadgeProgressKind =
  | 'binary' // either have it or not; no numeric progress via API
  | 'tiered' // multiple levels exist (e.g. Bug Hunter), but remaining progress is not in the API
  | 'meta'; // not a profile badge users chase (team / HTTP-interactions marker)

export interface BadgeDefinition {
  /** discord.js UserFlags bit name */
  flag: keyof typeof UserFlags;
  /** Bit value from Discord User Flags */
  bit: number;
  nameRu: string;
  nameEn: string;
  descriptionRu: string;
  /** Publicly documented / commonly known way to obtain — honest, not invented */
  howToRu: string;
  /** What we can honestly say about remaining requirements */
  remainingRu: string;
  progressKind: BadgeProgressKind;
  /** Prefer listing for “how to unlock” even if user does not have it */
  showWhenMissing?: boolean;
}

export const BADGE_CATALOG: BadgeDefinition[] = [
  {
    flag: 'Staff',
    bit: 1 << 0,
    nameRu: 'Discord Staff',
    nameEn: 'Discord Employee',
    descriptionRu: 'Сотрудник Discord. Показывается только у сотрудников компании.',
    howToRu: 'Только через трудоустройство в Discord. Публично «заработать» нельзя.',
    remainingRu: 'API не отдаёт прогресс — это бинарный служебный флаг.',
    progressKind: 'binary',
  },
  {
    flag: 'Partner',
    bit: 1 << 1,
    nameRu: 'Partner',
    nameEn: 'Partnered Server Owner',
    descriptionRu: 'Владелец партнёрского сервера Discord Partner Program.',
    howToRu:
      'Нужно владеть сервером, принятым в Discord Partner Program (отбор Discord). Программа и критерии меняются — смотрите актуальные условия Discord Partners.',
    remainingRu:
      'API не показывает статус заявки Partner и «сколько осталось» — только факт наличия бейджа.',
    progressKind: 'binary',
    showWhenMissing: true,
  },
  {
    flag: 'Hypesquad',
    bit: 1 << 2,
    nameRu: 'HypeSquad Events',
    nameEn: 'HypeSquad Events Member',
    descriptionRu: 'Участник программы HypeSquad Events (офлайн/ивент-амбассадор).',
    howToRu:
      'Исторически выдавался участникам HypeSquad Events. Набор и статус программы менялись — актуальные условия только у Discord.',
    remainingRu: 'API не отдаёт прогресс по ивентам или заявкам.',
    progressKind: 'binary',
  },
  {
    flag: 'BugHunterLevel1',
    bit: 1 << 3,
    nameRu: 'Bug Hunter (уровень 1)',
    nameEn: 'Bug Hunter Level 1',
    descriptionRu: 'Охотник за багами Discord — подтверждённые отчёты о уязвимостях/багах.',
    howToRu:
      'Отправляйте валидные баг-репорты через официальный Bug Bounty / Bug Hunter канал Discord. Уровень 1 — базовый бейдж после подтверждённых находок.',
    remainingRu:
      'API отдаёт только факт Level 1 / Level 2. Число отчётов и «сколько до Level 2» Discord ботам не раскрывает.',
    progressKind: 'tiered',
    showWhenMissing: true,
  },
  {
    flag: 'HypeSquadOnlineHouse1',
    bit: 1 << 6,
    nameRu: 'HypeSquad Bravery',
    nameEn: 'House Bravery',
    descriptionRu: 'Участник дома Bravery в HypeSquad.',
    howToRu:
      'Раньше дом выбирался в настройках пользователя (HypeSquad). Если опция доступна в клиенте — выберите дом Bravery.',
    remainingRu: 'Бинарный флаг дома. API не показывает «прогресс» по дому.',
    progressKind: 'binary',
    showWhenMissing: true,
  },
  {
    flag: 'HypeSquadOnlineHouse2',
    bit: 1 << 7,
    nameRu: 'HypeSquad Brilliance',
    nameEn: 'House Brilliance',
    descriptionRu: 'Участник дома Brilliance в HypeSquad.',
    howToRu:
      'Раньше дом выбирался в настройках пользователя (HypeSquad). Если опция доступна в клиенте — выберите дом Brilliance.',
    remainingRu: 'Бинарный флаг дома. API не показывает «прогресс» по дому.',
    progressKind: 'binary',
    showWhenMissing: true,
  },
  {
    flag: 'HypeSquadOnlineHouse3',
    bit: 1 << 8,
    nameRu: 'HypeSquad Balance',
    nameEn: 'House Balance',
    descriptionRu: 'Участник дома Balance в HypeSquad.',
    howToRu:
      'Раньше дом выбирался в настройках пользователя (HypeSquad). Если опция доступна в клиенте — выберите дом Balance.',
    remainingRu: 'Бинарный флаг дома. API не показывает «прогресс» по дому.',
    progressKind: 'binary',
    showWhenMissing: true,
  },
  {
    flag: 'PremiumEarlySupporter',
    bit: 1 << 9,
    nameRu: 'Early Supporter',
    nameEn: 'Early Nitro Supporter',
    descriptionRu: 'Ранний подписчик Nitro (до roughly October 2018). Исторический бейдж.',
    howToRu:
      'Больше не выдаётся новым пользователям. Нужно было иметь Nitro в ранний период продукта.',
    remainingRu: 'Закрытый исторический бейдж — «добрать» нельзя.',
    progressKind: 'binary',
  },
  {
    flag: 'TeamPseudoUser',
    bit: 1 << 10,
    nameRu: 'Team User',
    nameEn: 'Team Pseudo User',
    descriptionRu: 'Аккаунт команды разработчиков (team), а не обычный пользователь.',
    howToRu: 'Создаётся Discord как командный аккаунт приложения — не пользовательский бейдж профиля.',
    remainingRu: 'Служебный флаг, не цель для прокачки.',
    progressKind: 'meta',
  },
  {
    flag: 'BugHunterLevel2',
    bit: 1 << 14,
    nameRu: 'Bug Hunter (уровень 2)',
    nameEn: 'Bug Hunter Level 2',
    descriptionRu: 'Золотой Bug Hunter — более высокий уровень программы охоты за багами.',
    howToRu:
      'Продолжайте отправлять качественные подтверждённые баг-репорты. Конкретные пороги Discord публично ботам не отдаёт.',
    remainingRu:
      'Если есть Level 1, но нет Level 2: API не сообщает, сколько отчётов осталось. Если уже Level 2 — максимум известного тира в public_flags.',
    progressKind: 'tiered',
  },
  {
    flag: 'VerifiedBot',
    bit: 1 << 16,
    nameRu: 'Verified Bot',
    nameEn: 'Verified Bot',
    descriptionRu: 'Бот с официальной верификацией Discord (галочка).',
    howToRu:
      'Бот должен пройти верификацию Discord (обычно после порога по серверам/использованию и заявки). Это флаг бота, не человека.',
    remainingRu: 'API не показывает статус заявки на верификацию бота.',
    progressKind: 'binary',
  },
  {
    flag: 'VerifiedDeveloper',
    bit: 1 << 17,
    nameRu: 'Early Verified Bot Developer',
    nameEn: 'Early Verified Bot Developer',
    descriptionRu: 'Ранний разработчик верифицированного бота (до изменений программы ~август 2020).',
    howToRu: 'Исторический бейдж. Новым разработчикам обычно уже не выдаётся.',
    remainingRu: 'Закрытый исторический бейдж — прогресс недоступен.',
    progressKind: 'binary',
  },
  {
    flag: 'CertifiedModerator',
    bit: 1 << 18,
    nameRu: 'Moderator Programs Alumni',
    nameEn: 'Moderator Programs Alumni',
    descriptionRu: 'Участник/выпускник модераторских программ Discord (Moderator Programs Alumni).',
    howToRu:
      'Через официальные модераторские программы Discord (набор ограничен и меняется). Следите за анонсами Discord.',
    remainingRu: 'API не отдаёт статус заявки или прогресс по программе.',
    progressKind: 'binary',
    showWhenMissing: true,
  },
  {
    flag: 'BotHTTPInteractions',
    bit: 1 << 19,
    nameRu: 'HTTP Interactions Bot',
    nameEn: 'Bot HTTP Interactions',
    descriptionRu:
      'Бот работает только через HTTP interactions (без постоянного Gateway) и всё равно отображается online в списке.',
    howToRu: 'Технический флаг бота (Interactions Endpoint URL), не бейдж профиля пользователя.',
    remainingRu: 'Служебный флаг приложения.',
    progressKind: 'meta',
  },
  {
    flag: 'ActiveDeveloper',
    bit: 1 << 22,
    nameRu: 'Active Developer',
    nameEn: 'Active Developer',
    descriptionRu:
      'Активный разработчик приложений Discord (приложение с недавно использованной командой / активность по правилам программы).',
    howToRu:
      'Создайте приложение с slash-командой, выполните её в Discord, затем заберите бейдж на странице Active Developer: https://discord.com/developers/active-developer . Бейдж нужно периодически продлевать активностью (точные окна — у Discord).',
    remainingRu:
      'API отдаёт только наличие флага. Дату истечения и «дней до продления» бот через Bot API не видит.',
    progressKind: 'binary',
    showWhenMissing: true,
  },
];

export const CATALOG_BY_FLAG = new Map(
  BADGE_CATALOG.map((b) => [b.flag, b] as const),
);

/** Flags that are typically "profile badges" users care about */
export const PROFILE_BADGE_FLAGS = BADGE_CATALOG.filter((b) => b.progressKind !== 'meta');

export function resolveFlagDefinitions(flagNames: string[]): BadgeDefinition[] {
  const found: BadgeDefinition[] = [];
  for (const name of flagNames) {
    const def = CATALOG_BY_FLAG.get(name as keyof typeof UserFlags);
    if (def) found.push(def);
    else {
      found.push({
        flag: name as keyof typeof UserFlags,
        bit: 0,
        nameRu: name,
        nameEn: name,
        descriptionRu: `Флаг \`${name}\` пришёл из API, но нет локального описания в каталоге бота.`,
        howToRu: 'Смотрите актуальную документацию Discord User Flags.',
        remainingRu: 'Неизвестно — флаг не описан в каталоге.',
        progressKind: 'binary',
      });
    }
  }
  return found;
}
