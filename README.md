# near-defi-bot

Discord bot for NEARMobile DeFi stats (liquidity pools, lending/borrowing APRs, etc.)  
Posts TL;DRs of TVL, 24h volume, top pools, and lending/borrowing markets to designated channels and keeps them updated every 30 minutes.

---

## 🚀 Features

### Liquidity Pools Module
- Fetches global stats (TVL & 24h volume) from Ref Finance  
- Retrieves top-N liquidity pools by TVL, 24h volume & APY  
- Posts a rich Markdown TL;DR in a pinned message  

### Lending & Borrowing Module
- Fetches lending data from Burrow Finance API
- Shows top markets by supplied value, borrowed value, and supply APY
- Displays utilization rates and available liquidity
- Converts APR to APY with compound interest calculations

### General Features
- Automatically edits pinned messages on updates or bot restarts  
- Simple cron-based refresh every 30 minutes  
- Easy to extend with new modules  

---

## 🛠️ Prerequisites

- **Node.js** v18+  
- **npm** or **yarn**  
- A Discord Bot token with **Send Messages**, **Manage Messages**, **Pin Messages**, and **Embed Links** permissions  
- **PM2** installed globally:  
  ```bash
  npm install -g pm2
````

---

## ⚙️ Installation

1. **Clone** your repo and enter it:

   ```bash
   git clone https://github.com/yourusername/near-defi-bot.git
   cd near-defi-bot
   ```

2. **Install** dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure** environment:

   ```bash
   cp .env.example .env
   # then edit .env to set DISCORD_TOKEN, LIQUIDITY_CHANNEL_ID, and LENDING_CHANNEL_ID
   ```

4. **Build** TypeScript sources:

   ```bash
   npm run build
   ```

---

## 📦 Usage

### Development

```bash
npm run dev
```

Runs the bot with auto-reload (`ts-node-dev`).

### Production on Your Server

After cloning, installing, setting up `.env` and building:

```bash
# from your repo root
pm2 start npm --name near-defi-bot -- run dev
```

This tells PM2 to:

1. Invoke `npm run dev`
2. Keep the process alive and auto-restart on crashes
3. Label the process `near-defi-bot` for easy `pm2 logs`, `pm2 stop`, etc.

---

## 📑 Scripts

| Command           | Description                                       |
| ----------------- | ------------------------------------------------- |
| `npm run build`   | Compile TypeScript → JavaScript                   |
| `npm start`       | Run compiled bot (`node dist/main.js`)            |
| `npm run dev`     | Run in dev mode with auto-reload                  |
| **`pm2 start …`** | Start under PM2 (see Production section)          |
| `npm run report`  | Generate `repo_report.txt` (tree + file contents) |
| `npm run lint`    | Lint code via ESLint                              |
| `npm test`        | Run Jest test suite                               |

---

## 🗂️ Project Structure

```
near-defi-bot/
├── apps
│   └── bot
│       ├── src
│       │   ├── core
│       │   │   └── discord-bot.ts
│       │   ├── main.ts
│       │   └── modules
│       │       ├── liquidity
│       │       │   ├── liquidity.controller.ts
│       │       │   ├── liquidity.factory.ts
│       │       │   ├── liquidity.service.ts
│       │       │   ├── types.ts
│       │       │   └── utils.ts
│       │       └── lending
│       │           ├── lending.controller.ts
│       │           ├── lending.factory.ts
│       │           ├── lending.service.ts
│       │           ├── types.ts
│       │           └── utils.ts
│       └── test
│           └── modules
│               ├── liquidity/liquidity.service.spec.ts
│               └── lending/lending.service.spec.ts
├── scripts
│   └── test-lending.ts
├── ecosystem.config.js
├── generate_report.sh
├── jest.config.js
├── package.json
├── tsconfig.json
└── packages/shared
    ├── api-client.ts
    └── logger.ts
```

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m "Add my feature"`)
4. Push to your branch (`git push origin feature/my-feature`)
5. Open a Pull Request

Please ensure tests pass and linting is clean before opening a PR.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
