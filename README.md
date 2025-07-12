# Ebola QR Bot

A Telegram bot built with Cloudflare Workers for QR code management and storage. The bot allows users to store and retrieve QR codes associated with their Telegram usernames.

## 🚀 Features

- **Telegram Bot Integration**: Full Telegram bot functionality with webhook support
- **QR Code Management**: Store and retrieve QR codes by Telegram username
- **KV Storage**: Cloudflare KV storage for persistent QR data
- **TypeScript Support**: Fully typed with proper type definitions
- **Built with Hono**: Fast and lightweight web framework
- **Cloudflare Workers**: Serverless deployment on Cloudflare's edge network
- **Multi-Environment Support**: Development and production environments

## 🤖 Bot Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `/qr @username` | Retrieve QR code data for a specific user | Must mention the user with `@username` |
| `/qr --all` | List all QR codes in the system | Admin functionality only |
| `/qr_update` | Update your own QR code | Send a photo with this command |

## 📡 API Endpoints

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

## 📊 Data Structure

The KV storage uses the following data structure:

```typescript
interface QRData {
  username: string;     // Telegram username
  qrCode: string;       // File ID of the QR code photo
  createdAt: Date;      // When the record was created
  updatedAt: Date;      // When the record was last updated
}
```

## ⚙️ Environment Variables

The following environment variables need to be configured in your Cloudflare Workers:

| Variable | Description | Required |
|----------|-------------|----------|
| `TELEGRAM_BOT_TOKEN` | Your Telegram bot token from @BotFather | ✅ |
| `TELEGRAM_BOT_CUSTOM_SECRET` | Custom secret for webhook security | ✅ |
| `QR_DATA` | KV namespace binding for QR data storage | ✅ |

## 🛠️ Development

### Prerequisites
- Node.js (v22.16.0 or higher)
- npm or yarn
- Wrangler CLI
- Telegram Bot Token (from @BotFather)

### Setup

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd ebola-qr-bot
   npm install
   ```

2. **Configure environment variables:**
   
   Create a `.dev.vars` file for local development:
   ```env
   TELEGRAM_BOT_TOKEN=your_bot_token_here
   TELEGRAM_BOT_CUSTOM_SECRET=your_custom_secret_here
   ```

3. **Set up secrets for development:**
   ```bash
   npm run secret
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Set up webhook (after deployment):**
   ```bash
   curl -X POST https://your-worker.your-subdomain.workers.dev/set-webhook \
     -H "Content-Type: application/json" \
     -d '{"url": "https://your-worker.your-subdomain.workers.dev/webhook"}'
   ```

### Deployment

#### Development Environment
```bash
npm run deploy
```

#### Production Environment
```bash
npm run deploy:prod
```

### KV Namespace Setup

The KV namespace `QR_DATA` is configured in `wrangler.jsonc` with the namespace ID: `41ab7fae880e4ede954f65f21f797ae2`

## 📖 Usage Examples

### Setting up the bot

1. Create a bot with @BotFather on Telegram
2. Get your bot token
3. Deploy the worker using the deployment commands above
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
Send a photo with the caption:
```
/qr_update
```

## 📁 Project Structure

```
ebola-qr-bot/
├── src/
│   ├── controllers/          # Request handlers
│   │   ├── index.ts         # Controller exports
│   │   └── QrController.ts  # QR and webhook controllers
│   ├── dao/                 # Data Access Objects
│   │   ├── index.ts         # DAO exports
│   │   └── QrDao.ts         # QR data operations
│   ├── services/            # Business logic
│   │   ├── index.ts         # Service exports
│   │   ├── QrService.ts     # QR business logic
│   │   └── TelegramService.ts # Telegram API integration
│   ├── types/               # TypeScript type definitions
│   │   ├── errors/          # Custom error types
│   │   ├── QrData.ts        # QR data interface
│   │   └── Telegram*.ts     # Telegram API types
│   └── index.ts             # Main application entry point
├── package.json             # Dependencies and scripts
├── wrangler.jsonc           # Cloudflare Workers configuration
├── tsconfig.json            # TypeScript configuration
└── README.md               # This file
```

## 🛠️ Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run secret` | Set development secrets |
| `npm run secret:prod` | Set production secrets |
| `npm run deploy` | Deploy to development environment |
| `npm run deploy:prod` | Deploy to production environment |
| `npm run destroy` | Delete development environment |
| `npm run cf-typegen` | Generate Cloudflare types |

## 🏗️ Technologies Used

- **Cloudflare Workers**: Serverless runtime
- **Hono**: Fast web framework
- **TypeScript**: Type safety
- **Axios**: HTTP client for Telegram API
- **Cloudflare KV**: Key-value storage
- **Wrangler**: Cloudflare Workers CLI

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions, please:

1. Check the [Issues](../../issues) page for existing solutions
2. Create a new issue with detailed information about your problem
3. Contact the maintainer at `jotacemarin@gmail.com`
