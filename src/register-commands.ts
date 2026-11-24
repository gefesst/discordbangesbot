/**
 * One-shot registration of slash commands (without starting the gateway).
 * Usage: npm run register-commands
 */
import { REST, Routes } from 'discord.js';
import { config } from './config.js';
import { commands } from './commands/index.js';

async function main(): Promise<void> {
  const body = commands.map((c) => c.data.toJSON());
  const rest = new REST({ version: '10' }).setToken(config.token);

  if (config.guildId) {
    await rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), { body });
    console.log(`OK: guild commands → ${config.guildId}`);
  } else {
    await rest.put(Routes.applicationCommands(config.clientId), { body });
    console.log('OK: global application commands');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
