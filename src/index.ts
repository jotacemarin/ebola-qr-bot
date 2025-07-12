import { Hono } from "hono";
import { QrController } from "./controllers";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.post("/set-webhook", QrController.setWebhook);
app.post("/webhook", QrController.webhook);
app.post("/qr", QrController.getQr);
app.post("/qr_update", QrController.updateQr);

export default app;
