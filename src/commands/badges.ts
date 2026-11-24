import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
  type GuildMember,
} from 'discord.js';
import { inspectUserBadges } from '../badges/inspect.js';
import { buildBadgesEmbed } from '../utils/embeds.js';

export const data = new SlashCommandBuilder()
  .setName('badges')
  .setDescription('Показать публичные бейджи Discord пользователя')
  .addUserOption((opt) =>
    opt
      .setName('user')
      .setDescription('Пользователь (по умолчанию — вы)')
      .setRequired(false),
  );

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  await interaction.deferReply();

  const target = interaction.options.getUser('user') ?? interaction.user;

  let user = target;
  try {
    user = await target.fetch(true);
  } catch (err) {
    console.error('Не удалось принудительно обновить пользователя:', err);
  }

  let member: GuildMember | null = null;
  if (interaction.guild) {
    try {
      member = await interaction.guild.members.fetch(user.id);
    } catch {
      member = null;
    }
  }

  const inspection = inspectUserBadges(user, member);
  const embed = buildBadgesEmbed(inspection, user);

  await interaction.editReply({ embeds: [embed] });
}
