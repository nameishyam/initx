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

export function addEnvToFrontend(frontendDir: string) {
  const envPath = `${frontendDir}/.env`;

  const content = `VITE_API_URL=http://localhost:5000\n`;

  fs.writeFileSync(envPath, content);
}

export function injectApiCall(frontendDir: string, language: string) {
  const filePath =
    language === "ts"
      ? `${frontendDir}/src/main.tsx`
      : `${frontendDir}/src/main.jsx`;

  if (!fs.existsSync(filePath)) return;

  const existing = fs.readFileSync(filePath, "utf-8");

  if (existing.includes("VITE_API_URL")) return;

  const injection = `

const apiUrl = import.meta.env.VITE_API_URL;

fetch(\`\${apiUrl}/api/status\`)
  .then(res => res.json())
  .then(data => console.log("Backend status:", data))
  .catch(err => console.error("API error:", err));
`;

  fs.writeFileSync(filePath, existing + injection);
}
