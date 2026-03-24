import fs from "fs-extra";

export function generateBackendCode(authStrategy: string) {
  return `
const express = require('express');
${authStrategy === "cors" ? "const cors = require('cors');" : ""}
const app = express();
${authStrategy === "cors" ? "app.use(cors());" : ""}

app.get('/api/status', (req, res) => res.json({ status: 'ok', message: 'Backend connected!' }));

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
  `.trim();
}

export function addProxyToViteConfig(filePath: string) {
  let content = fs.readFileSync(filePath, "utf-8");

  if (content.includes("proxy")) return;

  if (content.includes("server:")) {
    content = content.replace(
      /server:\s*{/,
      `server: {
    proxy: { '/api': 'http://localhost:5000' },`,
    );
  } else {
    content = content.replace(
      /defineConfig\(\{/,
      `defineConfig({
  server: {
    proxy: { '/api': 'http://localhost:5000' }
  },`,
    );
  }
  fs.writeFileSync(filePath, content);
}
