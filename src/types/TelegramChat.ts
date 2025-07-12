export enum TelegramChatType {
  PRIVATE = "private",
  GROUP = "group",
  SUPERGROUP = "supergroup",
}

export interface TelegramChat {
  id: number | string;
  title: string;
  type: TelegramChatType | string;
  all_members_are_administrators: boolean;
}
