import { TelegramChat } from "./TelegramChat";
import { TelegramEntity } from "./TelegramEntity";
import { TelegramPhotoSize } from "./TelegramPhotoSize";
import { TelegramUser } from "./TelegramUser";

export interface TelegramMessage {
  message_id: number;
  from: TelegramUser;
  chat: TelegramChat;
  date: number;
  text: string;
  caption: string;
  reply_to_message: TelegramMessage;
  photo: Array<TelegramPhotoSize>;
  entities?: Array<TelegramEntity>;
  caption_entities?: Array<TelegramEntity>;
}
