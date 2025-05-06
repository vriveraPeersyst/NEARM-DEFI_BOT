# near-defi-bot

Discord bot for NEARMobile DeFi stats (liquidity pools, lending/borrowing APRs, etc.)  
Posts a TL;DR of TVL, 24 h volume, and top pools to a designated channel and keeps it updated.

---

## 🚀 Features

- Fetches global stats (TVL & 24 h volume) from Ref Finance  
- Retrieves top-N liquidity pools by TVL  
- Posts a rich Markdown TL;DR in a pinned message  
- Automatically edits the pinned message on updates or bot restarts  
- Easy to extend with new modules (lending, borrowing, etc.)  
- Runs under PM2 or Docker  

---

## 🛠️ Prerequisites

- **Node.js** v18+  
- **npm** or **yarn**  
- A Discord Bot token with **Send Messages**, **Manage Messages**, and **Pin Messages** permissions  

---

## ⚙️ Installation

1. Clone the repo:  
   ```bash
   git clone https://github.com/yourusername/near-defi-bot.git
   cd near-defi-bot
````

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Copy the example env and fill in your values:

   ```bash
   cp .env.example .env
   ```

4. Build the TypeScript sources:

   ```bash
   npm run build
   ```

---

## 📦 Usage

### Development

```bash
npm run dev
```

Runs the bot with `ts-node-dev` and auto-reloads on file changes.

### Production

Start via PM2:

```bash
npm run pm2
```

Or directly:

```bash
npm start
```

### Docker

```bash
docker build -f docker/bot.Dockerfile -t near-defi-bot .
docker run --env-file .env near-defi-bot
```

---

## 📑 Scripts

| Command          | Description                                       |
| ---------------- | ------------------------------------------------- |
| `npm run build`  | Compile TypeScript → JavaScript                   |
| `npm start`      | Run built bot (`dist/main.js`)                    |
| `npm run dev`    | Run in dev mode with auto-reload                  |
| `npm run pm2`    | Start under PM2 (uses `ecosystem.config.js`)      |
| `npm run report` | Generate `repo_report.txt` (tree + file contents) |
| `npm run lint`   | Lint code via ESLint                              |
| `npm test`       | Run Jest test suite                               |

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
│       │       └── liquidity
│       │           ├── liquidity.controller.ts
│       │           ├── liquidity.factory.ts
│       │           ├── liquidity.service.ts
│       │           ├── types.ts
│       │           └── utils.ts
│       └── test
│           └── modules/liquidity/liquidity.service.spec.ts
├── docker/bot.Dockerfile
├── ecosystem.config.js
├── generate_report.sh
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

