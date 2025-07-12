# Ebola QR Bot

A Telegram bot built with Cloudflare Workers for QR code management and storage. The bot allows users to store and retrieve QR codes associated with their Telegram usernames.

## Features

- **Telegram Bot Integration**: Full Telegram bot functionality with webhook support
- **QR Code Management**: Store and retrieve QR codes by Telegram username
- **KV Storage**: Cloudflare KV storage for persistent QR data
- **TypeScript Support**: Fully typed with proper type definitions
- **Built with Hono**: Fast and lightweight web framework
- **Cloudflare Workers**: Serverless deployment on Cloudflare's edge network

## Bot Commands

### `/qr @username`
Retrieve QR code data for a specific user. You must mention the user with `@username`.

### `/qr --all`
List all QR codes in the system (admin functionality).

### `/qr_update`
Update your own QR code by sending a photo with this command.

## API Endpoints

### Set Webhook
```http
POST /set-webhook
Content-Type: application/json

{
  "url": "https://your-domain.com/webhook"
}
```

### Telegram Webhook
```http
POST /webhook
Content-Type: application/json

{
  // Telegram Update object
}
```

### Get QR Data
```http
POST /qr
Content-Type: application/json

{
  // Telegram Update object with /qr command
}
```

### Update QR Data
```http
POST /qr_update
Content-Type: application/json

{
  // Telegram Update object with photo and /qr_update command
}
```

## Data Structure

The KV storage uses the following data structure:

```typescript
interface QRData {
  username: string;     // Telegram username
  qrCode: string;       // File ID of the QR code photo
  createdAt: Date;      // When the record was created
  updatedAt: Date;      // When the record was last updated
}
```

## Environment Variables

The following environment variables need to be configured in your Cloudflare Workers:

- `TELEGRAM_BOT_TOKEN`: Your Telegram bot token from @BotFather
- `TELEGRAM_BOT_CUSTOM_SECRET`: Custom secret for webhook security
- `QR_DATA`: KV namespace binding for QR data storage

## Development

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Wrangler CLI
- Telegram Bot Token (from @BotFather)

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Create a `.dev.vars` file for local development:
   ```
   TELEGRAM_BOT_TOKEN=your_bot_token_here
   TELEGRAM_BOT_CUSTOM_SECRET=your_custom_secret_here
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Set up webhook (after deployment):**
   ```bash
   curl -X POST https://your-worker.your-subdomain.workers.dev/set-webhook \
     -H "Content-Type: application/json" \
     -d '{"url": "https://your-worker.your-subdomain.workers.dev/webhook"}'
   ```

5. **Deploy to Cloudflare:**
   ```bash
   npm run deploy
   ```

### KV Namespace Setup

The KV namespace `QR_DATA` is configured in `wrangler.jsonc`. The namespace ID is: `41ab7fae880e4ede954f65f21f797ae2`

## Usage Examples

### Setting up the bot

1. Create a bot with @BotFather on Telegram
2. Get your bot token
3. Deploy the worker
4. Set the webhook URL
5. Start using the bot commands

### Bot Commands in Telegram

**Get QR for a specific user:**
```
/qr @username
```

**List all QR codes (admin):**
```
/qr --all
```

**Update your QR code:**
Send a photo with the caption
```
/qr_update
```

## Project Structure

```
src/
├── controllers/          # Request handlers
│   ├── index.ts         # Controller exports
│   └── QrController.ts  # QR and webhook controllers
├── dao/                 # Data Access Objects
│   ├── index.ts         # DAO exports
│   └── QrDao.ts         # QR data operations
├── services/            # Business logic
│   ├── index.ts         # Service exports
│   ├── QrService.ts     # QR business logic
│   └── TelegramService.ts # Telegram API integration
├── types/               # TypeScript type definitions
│   ├── errors/          # Custom error types
│   ├── QrData.ts        # QR data interface
│   └── Telegram*.ts     # Telegram API types
└── index.ts             # Main application entry point
```

## Technologies Used

- **Cloudflare Workers**: Serverless runtime
- **Hono**: Fast web framework
- **TypeScript**: Type safety
- **Axios**: HTTP client for Telegram API
- **Cloudflare KV**: Key-value storage
- **Wrangler**: Cloudflare Workers CLI

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
