import { QRData } from "../types";

export class QrDao {
  constructor(private kv: KVNamespace) {}

  async getAllQR(prefix?: string): Promise<QRData[]> {
    const list = await this.kv.list({ prefix });

    const promises = list.keys.map(async (key) => {
      const data = await this.kv.get(key.name);
      if (data) {
        return JSON.parse(data) as QRData;
      }
      return null;
    });

    const results = await Promise.all(promises);

    return results.filter((data): data is QRData => data !== null);
  }

  async getQRData(username: string): Promise<QRData | null> {
    const data = await this.kv.get(username);
    if (!data) {
      return null;
    }

    return JSON.parse(data) as QRData;
  }

  async updateQr(telegramUsername: string, qrPathId: string): Promise<QRData> {
    const existingData = await this.getQRData(telegramUsername);

    const updatedQRData: QRData = {
      qrPathId,
      createdAt: existingData?.createdAt ?? new Date(),
      updatedAt: new Date(),
    };

    await this.kv.put(telegramUsername, JSON.stringify(updatedQRData));

    return updatedQRData;
  }

  async getQRDataByPrefix(prefix: string): Promise<QRData[]> {
    return this.getAllQR(prefix);
  }
}
