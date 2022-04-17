import { Telegraf, Context } from 'telegraf';
import config from '../../config';

const bot = new Telegraf(config.BOT_TOKEN);

/**
 * Middlewares
 */

bot.use(async (ctx: Context, next) => {
  try {
    const user = ctx.message?.from;

    if (user && config.WHITELISTED_USERS.includes(`${user.id}`)) {
      await next();
      return;
    } else {
      return ctx.reply(`Please contact @copolar to activate your account`);
    }
  } catch (error) {
    console.error(`Error:`, error);
  }
});

bot.start(async (ctx: Context) => {
  const user = ctx.message?.from;

  const defaultMessage = `Hello ${
    user?.username ? user.username : user?.last_name
  }, welcome to ${ctx.botInfo.first_name}`;
  return ctx.reply(defaultMessage);
});

const sendMessage = async (message: string) => {
  for (const id of config.WHITELISTED_USERS) {
    try {
      await bot.telegram.sendMessage(
        id,
        message
          .replaceAll('_', '\\_')
          .replaceAll('|', '\\|')
          .replaceAll('.', '\\.')
          .replaceAll('{', '\\{')
          .replaceAll('}', '\\}')
          .replaceAll('=', '\\=')
          .replaceAll('+', '\\+')
          .replaceAll('>', '\\>')
          .replaceAll('<', '\\<')
          .replaceAll('-', '\\-')
          .replaceAll('!', '\\!'),
        {
          parse_mode: 'MarkdownV2',
          disable_web_page_preview: true,
        }
      );
    } catch (error) {}
  }
};

export { bot, sendMessage };
