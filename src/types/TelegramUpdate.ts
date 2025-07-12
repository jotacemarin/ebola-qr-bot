import { TelegramMessage } from "./TelegramMessage";
import { TelegramUser } from "./TelegramUser";

export interface TelegramUpdate {
  update_id: number | string;
  message: TelegramMessage;
  callback_query?: {
    id: string;
    from: TelegramUser;
    message: TelegramMessage;
    chat_instance: string;
    data: string;
  };
}
