import type {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
} from 'discord.js';
import * as badges from './badges.js';
import * as badgesInfo from './badges-info.js';
import * as help from './help.js';

export interface BotCommand {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export const commands: BotCommand[] = [badges, badgesInfo, help];

export const commandMap = new Map(commands.map((c) => [c.data.name, c]));
