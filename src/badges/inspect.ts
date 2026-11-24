import {
  GuildMember,
  type User,
  type UserFlagsString,
} from 'discord.js';
import {
  PROFILE_BADGE_FLAGS,
  resolveFlagDefinitions,
  type BadgeDefinition,
} from './catalog.js';

export interface InspectedBadge {
  definition: BadgeDefinition;
  owned: boolean;
  /** Extra status line (levels, boost duration, etc.) */
  statusRu: string;
  remainingRu: string;
}

export interface BadgeInspection {
  user: User;
  owned: InspectedBadge[];
  /** Helpful “not owned but unlockable / notable” entries */
  missingNotable: InspectedBadge[];
  extras: string[];
  apiGapsRu: string[];
}

function bugHunterStatus(flags: Set<string>): { statusRu: string; remainingRu: string } | null {
  const l1 = flags.has('BugHunterLevel1');
  const l2 = flags.has('BugHunterLevel2');
  if (!l1 && !l2) return null;
  if (l2) {
    return {
      statusRu: 'Уровень 2 (максимум в public_flags)',
      remainingRu: 'Дальнейший прогресс через API недоступен (если Discord и выдаёт что-то выше — ботам это не отдаётся).',
    };
  }
  return {
    statusRu: 'Уровень 1',
    remainingRu:
      'До Level 2: Discord не публикует ботам оставшееся число отчётов. Продолжайте качественные баг-репорты через официальную программу.',
  };
}

function hypesquadHouseNote(flags: Set<string>): string | null {
  const houses = [
    flags.has('HypeSquadOnlineHouse1') ? 'Bravery' : null,
    flags.has('HypeSquadOnlineHouse2') ? 'Brilliance' : null,
    flags.has('HypeSquadOnlineHouse3') ? 'Balance' : null,
  ].filter(Boolean);
  if (houses.length === 0) return null;
  return `Дом HypeSquad: ${houses.join(', ')}`;
}

export function inspectUserBadges(user: User, member: GuildMember | null): BadgeInspection {
  // Force-fetch often needed so public_flags are populated
  const flagBitfield = user.flags;
  const flagNames = ((flagBitfield?.toArray() ?? []) as UserFlagsString[]).filter(
    (name) => name !== 'None' && name.length > 0,
  );
  const flagSet = new Set<string>(flagNames);

  const ownedDefs = resolveFlagDefinitions(flagNames).filter((d) => d.progressKind !== 'meta' || flagSet.has(d.flag));
  // Prefer non-meta first; still show meta if present (bots)
  const orderedOwned = [
    ...ownedDefs.filter((d) => d.progressKind !== 'meta'),
    ...ownedDefs.filter((d) => d.progressKind === 'meta'),
  ];

  // Dedupe by flag
  const seen = new Set<string>();
  const uniqueOwned: BadgeDefinition[] = [];
  for (const d of orderedOwned) {
    if (seen.has(d.flag)) continue;
    seen.add(d.flag);
    uniqueOwned.push(d);
  }

  const bh = bugHunterStatus(flagSet);

  const owned: InspectedBadge[] = uniqueOwned.map((definition) => {
    let statusRu = 'Получен';
    let remainingRu = definition.remainingRu;

    if (definition.flag === 'BugHunterLevel1' || definition.flag === 'BugHunterLevel2') {
      if (bh) {
        statusRu = bh.statusRu;
        remainingRu = bh.remainingRu;
      }
    }

    if (
      definition.flag === 'HypeSquadOnlineHouse1' ||
      definition.flag === 'HypeSquadOnlineHouse2' ||
      definition.flag === 'HypeSquadOnlineHouse3'
    ) {
      statusRu = `Активен (${definition.nameEn})`;
    }

    return { definition, owned: true, statusRu, remainingRu };
  });

  const missingNotable: InspectedBadge[] = PROFILE_BADGE_FLAGS.filter(
    (d) => d.showWhenMissing && !flagSet.has(d.flag),
  )
    // Don't suggest other houses if user already has a house
    .filter((d) => {
      const hasHouse =
        flagSet.has('HypeSquadOnlineHouse1') ||
        flagSet.has('HypeSquadOnlineHouse2') ||
        flagSet.has('HypeSquadOnlineHouse3');
      if (
        hasHouse &&
        (d.flag === 'HypeSquadOnlineHouse1' ||
          d.flag === 'HypeSquadOnlineHouse2' ||
          d.flag === 'HypeSquadOnlineHouse3')
      ) {
        return false;
      }
      // If already BH L2, don't list L1 as missing
      if (d.flag === 'BugHunterLevel1' && flagSet.has('BugHunterLevel2')) return false;
      return true;
    })
    .map((definition) => ({
      definition,
      owned: false,
      statusRu: 'Не получен (по public_flags)',
      remainingRu: `${definition.howToRu}\n⚠️ ${definition.remainingRu}`,
    }));

  const extras: string[] = [];
  const house = hypesquadHouseNote(flagSet);
  if (house) extras.push(house);

  if (user.bot) {
    extras.push('Это бот-аккаунт (часть флагов относится к ботам, а не к людям).');
  }

  // Guild boost — only for the current guild, via Guild Member object
  if (member?.premiumSince) {
    const since = member.premiumSince;
    const days = Math.floor((Date.now() - since.getTime()) / (1000 * 60 * 60 * 24));
    extras.push(
      `Буст этого сервера с <t:${Math.floor(since.getTime() / 1000)}:D> (~${days} дн.). Глобальный бейдж месяцев буста и Nitro API боту недоступны.`,
    );
  } else if (member) {
    extras.push('На этом сервере буст не обнаружен (`premium_since` пуст).');
  }

  // Avatar decoration (public on user object in recent API / discord.js)
  const decoration = user.avatarDecorationData;
  if (decoration) {
    extras.push(
      `Есть украшение аватара (SKU \`${decoration.skuId}\`). Это не public_flags-бейдж; прогресс/коллекция через Bot API недоступны.`,
    );
  }

  // Primary guild / server tag if discord.js exposes it
  const primaryGuild = (user as User & { primaryGuild?: { identityEnabled: boolean | null; tag: string | null } | null })
    .primaryGuild;
  if (primaryGuild?.identityEnabled && primaryGuild.tag) {
    extras.push(`Server Tag (primary guild): \`${primaryGuild.tag}\`.`);
  }

  const apiGapsRu = [
    'Nitro / Nitro Classic / Nitro Basic — `premium_type` доступен только для OAuth2 `@me` с scope `identify`/`identify.premium`, не через Bot Token для чужих пользователей.',
    'Бейджи квестов, Orbs, Legacy Username, месяцы буста (1–24), значки событий и большинство «новых» profile badges — не входят в `public_flags`.',
    'Числовой прогресс (отчёты Bug Hunter, срок Active Developer) Discord ботам не отдаёт.',
  ];

  return { user, owned, missingNotable, extras, apiGapsRu };
}

