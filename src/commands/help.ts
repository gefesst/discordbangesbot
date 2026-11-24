import { SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js';
import { buildHelpEmbed } from '../utils/embeds.js';

export const data = new SlashCommandBuilder()
  .setName('help')
  .setDescription('Справка по боту бейджей');

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  await interaction.reply({ embeds: [buildHelpEmbed()], ephemeral: true });
}
