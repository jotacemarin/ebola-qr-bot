/// <reference types="@cloudflare/workers-types" />
/// <reference path="../../worker-configuration.d.ts" />

export interface QRData {
  qrPathId: string;
  createdAt: Date;
  updatedAt: Date;
}
