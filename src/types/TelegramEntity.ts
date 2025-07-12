export enum TelegramEntityType {
  BOT_COMMAND = "bot_command",
  MENTION = "mention",
  HASHTAG = "hashtag",
  CASHTAG = "cashtag",
  PHONE_NUMBER = "phone_number",
  BOLD = "bold",
  ITALIC = "italic",
  UNDERLINE = "underline",
  STRIKETHROUGH = "strikethrough",
}

export interface TelegramEntity {
  offset: number;
  length: number;
  type: TelegramEntityType;
}
