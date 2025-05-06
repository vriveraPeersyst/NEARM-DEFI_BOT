module.exports = {
    apps: [
      {
        name: "near-defi-bot",
        script: "dist/main.js",
        env: {
          NODE_ENV: "production",
        },
      },
    ],
  };
  