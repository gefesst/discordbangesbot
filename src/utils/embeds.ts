import { EmbedBuilder, type User } from 'discord.js';
import type { BadgeInspection, InspectedBadge } from '../badges/inspect.js';

const COLOR = 0x5865f2;

function formatBadgeBlock(b: InspectedBadge, verboseRemaining: boolean): string {
  const title = `**${b.definition.nameRu}** (${b.definition.nameEn})`;
  const lines = [
    title,
    b.definition.descriptionRu,
    `Статус: ${b.statusRu}`,
  ];
  if (verboseRemaining) {
    lines.push(`Что дальше: ${b.remainingRu}`);
  }
  return lines.join('\n');
}

export function buildBadgesEmbed(inspection: BadgeInspection, target: User): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setColor(COLOR)
    .setTitle(`Бейджи: ${target.displayName}`)
    .setThumbnail(target.displayAvatarURL({ size: 256 }))
    .setFooter({
      text: 'Данные из public_flags (+ буст текущего сервера). Не всё видно через Bot API.',
    })
    .setTimestamp(new Date());

  if (inspection.owned.length === 0) {
    embed.addFields({
      name: 'Публичные бейджи (public_flags)',
      value:
        'У пользователя нет публичных флагов-бейджей, которые отдаёт API.\nЭто не значит, что в клиенте Discord пусто: Nitro, бусты, квесты и др. часто **не** входят в `public_flags`.',
    });
  } else {
    // Discord field value max 1024; split carefully
    const chunks: string[] = [];
    let current = '';
    for (const badge of inspection.owned) {
      const block = formatBadgeBlock(badge, true);
      if (current.length + block.length + 2 > 1000) {
        chunks.push(current);
        current = block;
      } else {
        current = current ? `${current}\n\n${block}` : block;
      }
    }
    if (current) chunks.push(current);

    chunks.forEach((value, i) => {
      embed.addFields({
        name: i === 0 ? `Полученные (${inspection.owned.length})` : `Полученные (продолжение)`,
        value,
      });
    });
  }

  if (inspection.missingNotable.length > 0) {
    const missingText = inspection.missingNotable
      .slice(0, 6)
      .map((b) => {
        const shortHow =
          b.definition.howToRu.length > 180
            ? `${b.definition.howToRu.slice(0, 177)}…`
            : b.definition.howToRu;
        return `**${b.definition.nameRu}** — не в public_flags.\n${shortHow}`;
      })
      .join('\n\n');

    embed.addFields({
      name: 'Потенциально доступные (по публичным правилам)',
      value: missingText.slice(0, 1024),
    });
  }

  if (inspection.extras.length > 0) {
    embed.addFields({
      name: 'Дополнительно',
      value: inspection.extras.join('\n').slice(0, 1024),
    });
  }

  embed.addFields({
    name: 'Ограничения API',
    value: inspection.apiGapsRu.map((g) => `• ${g}`).join('\n').slice(0, 1024),
  });

  return embed;
}

export function buildHelpEmbed(): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(COLOR)
    .setTitle('Справка: бейджи Discord')
    .setDescription(
      [
        'Бот читает **`public_flags`** пользователя (и буст **текущего** сервера через `GuildMember.premium_since`).',
        '',
        '**Команды**',
        '`/badges` — бейджи свои или указанного пользователя',
        '`/badges-info` — каталог известных public_flags и как их обычно получают',
        '',
        'Бот **не выдумывает** числовой прогресс, если Discord его не отдаёт.',
      ].join('\n'),
    );
}
