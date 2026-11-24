import 'dotenv/config';

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(
      `Отсутствует обязательная переменная окружения ${name}. Скопируйте .env.example → .env и заполните значения.`,
    );
  }
  return value;
}

export const config = {
  token: required('DISCORD_TOKEN'),
  clientId: required('CLIENT_ID'),
  guildId: process.env.GUILD_ID?.trim() || undefined,
};
