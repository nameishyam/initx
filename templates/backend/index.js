import express from "express";
import cors from "cors";
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.get("/api/status", (req, res) => {
  res.json({ status: "ok", message: "Backend is active." });
});

app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});
