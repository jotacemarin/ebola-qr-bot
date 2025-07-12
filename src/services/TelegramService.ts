import axios, { AxiosInstance } from "axios";
import { Context } from "hono";

const initTelegramService = (
  c: Context<{ Bindings: CloudflareBindings }>
): AxiosInstance => {
  const telegramService = axios.create({
    baseURL: `https://${c.env.TELEGRAM_BOT_API}${c.env.TELEGRAM_BOT_TOKEN}`,
  });

  return telegramService;
};

const setWebhook = async (
  c: Context<{ Bindings: CloudflareBindings }>,
  url: string
): Promise<void> => {
  const telegramService = initTelegramService(c);

  const response = await telegramService.post("/setWebhook", {
    url,
    secret_token: c.env.TELEGRAM_BOT_CUSTOM_SECRET,
  });

  return response.data;
};

const getChatMember = async (
  c: Context<{ Bindings: CloudflareBindings }>,
  chatId: string,
  userId: string
): Promise<void> => {
  const telegramService = initTelegramService(c);

  const response = await telegramService.get(`/getChatMember`, {
    params: {
      chat_id: chatId,
      user_id: userId,
    },
  });

  return response.data;
};

const sendMessage = async (
  c: Context<{ Bindings: CloudflareBindings }>,
  params: {
    chatId: number | string;
    message: string;
    replyToMessageId?: number | string;
  }
): Promise<void> => {
  const telegramService = initTelegramService(c);

  const response = await telegramService.post("/sendMessage", {
    chat_id: params.chatId,
    text: params.message,
    parse_mode: "HTML",
    reply_to_message_id: params?.replyToMessageId,
  });

  return response.data;
};

const sendPhoto = async (
  c: Context<{ Bindings: CloudflareBindings }>,
  params: {
    chatId: number | string;
    photo: string;
    message?: string;
    replyToMessageId?: number | string;
  }
): Promise<void> => {
  const telegramService = initTelegramService(c);

  const response = await telegramService.post("/sendPhoto", {
    chat_id: params.chatId,
    photo: params.photo,
    caption: params.message,
    parse_mode: "HTML",
    reply_to_message_id: params?.replyToMessageId,
  });

  return response.data;
};

export { setWebhook, getChatMember, sendMessage, sendPhoto };
