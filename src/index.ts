import {
  Client,
  Events,
  GatewayIntentBits,
  Partials,
  REST,
  Routes,
} from 'discord.js';
import { config } from './config.js';
import { commandMap, commands } from './commands/index.js';

async function registerSlashCommands(clientId: string, token: string): Promise<void> {
  const body = commands.map((c) => c.data.toJSON());
  const rest = new REST({ version: '10' }).setToken(token);

  if (config.guildId) {
    await rest.put(Routes.applicationGuildCommands(clientId, config.guildId), { body });
    console.log(`Slash-команды зарегистрированы для гильдии ${config.guildId}`);
  } else {
    await rest.put(Routes.applicationCommands(clientId), { body });
    console.log('Глобальные slash-команды зарегистрированы (появление может занять до ~1 часа)');
  }
}

async function main(): Promise<void> {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      // Needed to resolve GuildMember.premiumSince for boost info on the current server
      GatewayIntentBits.GuildMembers,
    ],
    partials: [Partials.User],
  });

  client.once(Events.ClientReady, async (readyClient) => {
    console.log(`Бот вошёл как ${readyClient.user.tag}`);
    try {
      await registerSlashCommands(config.clientId, config.token);
    } catch (err) {
      console.error('Не удалось зарегистрировать slash-команды:', err);
    }
  });

  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = commandMap.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (err) {
      console.error(`Ошибка команды /${interaction.commandName}:`, err);
      const payload = {
        content:
          'Произошла ошибка при выполнении команды. Попробуйте ещё раз позже. Если повторяется — проверьте логи бота и права/интенты.',
        ephemeral: true,
      };
      try {
        if (interaction.deferred || interaction.replied) {
          await interaction.followUp(payload);
        } else {
          await interaction.reply(payload);
        }
      } catch (replyErr) {
        console.error('Не удалось отправить сообщение об ошибке:', replyErr);
      }
    }
  });

  client.on(Events.Error, (err) => {
    console.error('Ошибка клиента Discord.js:', err);
  });

  process.on('unhandledRejection', (reason) => {
    console.error('Unhandled rejection:', reason);
  });

  await client.login(config.token);
}

main().catch((err) => {
  console.error('Не удалось запустить бота:', err);
  process.exit(1);
});
