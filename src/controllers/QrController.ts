import { Context } from "hono";
import { QrService, TelegramService } from "../services";
import { BadRequest, TelegramUpdate } from "../types";
import { ContentfulStatusCode } from "hono/utils/http-status";

const getCommand = (body: TelegramUpdate) => {
  if (body?.message?.from?.is_bot) {
    return "default";
  }

  const telegramText = body?.message?.caption ?? body?.message?.text ?? "";
  const telegramEntities =
    body?.message?.caption_entities ?? body?.message?.entities ?? [];

  const commandEntity = telegramEntities?.find(
    (entity) => entity?.type === "bot_command"
  );
  if (!commandEntity) {
    return "default";
  }

  return String(telegramText)
    .substring(
      commandEntity.offset,
      commandEntity.offset + commandEntity.length
    )
    .replace("/", "");
};

const logError = async (
  c: Context<{ Bindings: CloudflareBindings }>,
  error: unknown | BadRequest
) => {
  const body = (await c.req.json()) as TelegramUpdate;
  const {
    message: {
      message_id: messageId,
      chat: { id: chatId },
    },
  } = body;

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

  return { errorMessage, statusCode };
};

const setWebhook = async (c: Context<{ Bindings: CloudflareBindings }>) => {
  const { url } = await c.req.json();

  const webhookInfo = await TelegramService.setWebhook(c, url);

  const chatMenu = await TelegramService.setChatMenu(c, [
    {
      command: "qr",
      description: "/qr @mention (Get QR code)",
    },
    {
      command: "qr_update",
      description: "/qr_update attach photo (Update QR code)",
    },
  ]);

  return c.json({
    message: "Webhook set successfully",
    webhook: webhookInfo,
    menu: chatMenu,
  });
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

    if (Array.isArray(qrs)) {
      await TelegramService.sendMessage(c, {
        chatId: body.message.chat.id,
        message: `Found ${qrs.length} QR codes`,
        replyToMessageId: body.message.message_id,
      });
    }

    if (!Array.isArray(qrs) && qrs?.qrPathId) {
      await TelegramService.sendPhoto(c, {
        chatId: body.message.chat.id,
        photo: qrs?.qrPathId,
        replyToMessageId: body.message.message_id,
      });
    }

    return c.json({ success: true, data: qrs });
  } catch (error) {
    const { errorMessage, statusCode } = await logError(c, error);
    return c.json({ error: errorMessage, status: statusCode }, 200);
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
  } catch (error) {
    const { errorMessage, statusCode } = await logError(c, error);
    return c.json({ error: errorMessage, status: statusCode }, 200);
  }
};

export { setWebhook, webhook, getQr, updateQr };
