import { Context } from "hono";
import { QrDao } from "../dao";
import { BadRequest, NotFound, QRData, TelegramUpdate } from "../types";

const getAllQr = async (
  c: Context<{ Bindings: CloudflareBindings }>,
  telegramUpdate: TelegramUpdate,
  prefix?: string
): Promise<Array<QRData> | null> => {
  const {
    message: { text, entities },
  } = telegramUpdate;
  const listAll = text.includes("--all") || text.includes("—all");
  const mention = entities?.find((entity) => entity?.type === "mention");

  if (listAll && !mention) {
    const qrDao = new QrDao(c.env.QR_DATA);
    const qrDataList = await qrDao.getAllQR(prefix);

    return qrDataList;
  }

  return null;
};

const getQrByUsername = async (
  c: Context<{ Bindings: CloudflareBindings }>,
  telegramUpdate: TelegramUpdate
): Promise<QRData> => {
  const {
    message: { text, entities },
  } = telegramUpdate;
  const mention = entities?.find((entity) => entity?.type === "mention");
  if (!mention) {
    throw new BadRequest("Mention is required");
  }

  const username = String(text)
    .substring(mention.offset, mention.offset + mention.length)
    .replace("@", "");

  const qrDao = new QrDao(c.env.QR_DATA);
  const qrData = await qrDao.getQRData(username);

  if (!qrData) {
    throw new NotFound("QR data not found");
  }

  return qrData;
};

const getQr = async (
  c: Context<{ Bindings: CloudflareBindings }>,
  telegramUpdate: TelegramUpdate
): Promise<QRData | Array<QRData>> => {
  const allQrs = await getAllQr(c, telegramUpdate);
  if (allQrs) {
    return allQrs;
  }

  return getQrByUsername(c, telegramUpdate);
};

const updateQr = async (
  c: Context<{ Bindings: CloudflareBindings }>,
  telegramUpdate: TelegramUpdate
): Promise<QRData> => {
  if (!telegramUpdate?.message?.from?.username) {
    throw new BadRequest("username is required");
  }

  if (!telegramUpdate?.message?.photo) {
    throw new BadRequest("a photo is required to update the QR");
  }

  const bigPhoto = telegramUpdate.message.photo
    ?.sort((a, b) => a?.file_size - b?.file_size)
    ?.at(0);

  if (!bigPhoto?.file_id) {
    throw new BadRequest("invalid photo object");
  }

  const qrDao = new QrDao(c.env.QR_DATA);
  const qrData = await qrDao.updateQr(
    telegramUpdate.message?.from?.username,
    bigPhoto.file_id
  );

  return qrData;
};

export { getQr, updateQr, getAllQr, getQrByUsername };
