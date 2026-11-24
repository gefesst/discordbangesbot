import { SlashCommandBuilder, EmbedBuilder, type ChatInputCommandInteraction } from 'discord.js';
import { BADGE_CATALOG } from '../badges/catalog.js';

export const data = new SlashCommandBuilder()
  .setName('badges-info')
  .setDescription('Каталог известных public_flags и как их обычно получают');

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  await interaction.deferReply({ ephemeral: true });

  const profile = BADGE_CATALOG.filter((b) => b.progressKind !== 'meta');

  const embeds: EmbedBuilder[] = [];
  let page: string[] = [];
  let pageIndex = 0;

  const flush = () => {
    if (page.length === 0) return;
    embeds.push(
      new EmbedBuilder()
        .setColor(0x5865f2)
        .setTitle(pageIndex === 0 ? 'Каталог бейджей (public_flags)' : `Каталог (часть ${pageIndex + 1})`)
        .setDescription(page.join('\n\n').slice(0, 4096))
        .setFooter({
          text: 'Основано на публичных User Flags Discord. Прогресс «сколько осталось» API обычно не даёт.',
        }),
    );
    page = [];
    pageIndex += 1;
  };

  for (const b of profile) {
    const block = [
      `**${b.nameRu}** — ${b.nameEn}`,
      b.descriptionRu,
      `_Как получить:_ ${b.howToRu}`,
      `_Прогресс в API:_ ${b.remainingRu}`,
    ].join('\n');

    const joined = page.length ? `${page.join('\n\n')}\n\n${block}` : block;
    if (joined.length > 3800) {
      flush();
      page.push(block);
    } else {
      page.push(block);
    }
  }
  flush();

  embeds.push(
    new EmbedBuilder()
      .setColor(0xed4245)
      .setTitle('Чего Bot API не показывает')
      .setDescription(
        [
          '• **Nitro** (тип подписки) для чужих пользователей',
          '• **Месяцы серверного буста** как глобальный бейдж профиля (1 / 2 / 3 / 6 / 9 / 12 / 15 / 18 / 24 мес.)',
          '• Бейджи **квестов**, Orbs, Legacy Username, большинство ивентовых значков',
          '• Числовой прогресс Bug Hunter / срок Active Developer',
          '',
          'Команда `/badges` показывает только то, что реально видно через `public_flags` и (в гильдии) `premium_since`.',
        ].join('\n'),
      ),
  );

  await interaction.editReply({ embeds: embeds.slice(0, 10) });
}
