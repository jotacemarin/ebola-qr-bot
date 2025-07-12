import { Context } from "hono";
import { QrService, TelegramService } from "../services";
import { BadRequest, TelegramUpdate } from "../types";
import { ContentfulStatusCode } from "hono/utils/http-status";

const getCommand = (body: TelegramUpdate) => {
  const { message } = body;
  const { text, caption, entities, caption_entities } = message;
  const telegramText = caption ?? text;
  const telegramEntities = caption_entities ?? entities;

  const commandEntity = telegramEntities?.find(
    (entity) => entity?.type === "bot_command"
  );
  if (!commandEntity) {
    return "default";
  }

  const command = String(telegramText)
    .substring(
      commandEntity.offset,
      commandEntity.offset + commandEntity.length
    )
    .replace("/", "");

  return command;
};

const setWebhook = async (c: Context<{ Bindings: CloudflareBindings }>) => {
  const { url } = await c.req.json();

  await TelegramService.setWebhook(c, url);

  return c.json({ message: "Webhook set successfully" });
};

const webhook = async (c: Context<{ Bindings: CloudflareBindings }>) => {
  const body = (await c.req.json()) as TelegramUpdate;

  const command = getCommand(body);
  const controllers = {
    qr: getQr,
    qr_update: updateQr,
    default: () => c.json({ message: "Ignored" }, 200),
  };

  const controller =
    controllers[command as keyof typeof controllers] ?? controllers.default;
  return controller(c);
};

const getQr = async (c: Context<{ Bindings: CloudflareBindings }>) => {
  const body = (await c.req.json()) as TelegramUpdate;

  try {
    const qrs = await QrService.getQr(c, body);

    return c.json({ success: true, data: qrs });
  } catch (error) {
    if (error instanceof BadRequest) {
      return c.json({ error: error?.message }, error?.statusCode);
    }

    return c.json({ error: "Failed to get QR" }, 500);
  }
};

const updateQr = async (c: Context<{ Bindings: CloudflareBindings }>) => {
  const body = (await c.req.json()) as TelegramUpdate;
  const {
    message: {
      message_id: messageId,
      chat: { id: chatId },
    },
  } = body;

  try {
    const qrData = await QrService.updateQr(c, body);
    await TelegramService.sendMessage(c, {
      chatId: chatId,
      message: "QR updated successfully",
      replyToMessageId: messageId,
    });

    return c.json({ success: true, data: qrData });
  } catch (error: unknown | BadRequest) {
    let errorMessage: string = (error as Error)?.message ?? "Unknown error";
    let statusCode: ContentfulStatusCode = 500;

    if (error instanceof BadRequest) {
      errorMessage = error?.message ?? "Bad request";
      statusCode = error?.statusCode ?? 400;
    }

    await TelegramService.sendMessage(c, {
      chatId: chatId,
      message: `Failed to update QR: ${errorMessage}`,
      replyToMessageId: messageId,
    });

    return c.json({ error: errorMessage }, statusCode);
  }
};

export { setWebhook, webhook, getQr, updateQr };
