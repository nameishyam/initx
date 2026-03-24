import fs from "fs-extra";
import path from "path";

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

export function generateViteConfig(language: string) {
  return `
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: { '/api': 'http://localhost:5000' }
  }
})`.trim();
}
