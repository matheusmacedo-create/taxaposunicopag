import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";

const app = express();
app.use(cors());
app.use(express.json());

let apiKeys: any[] = [];

app.get("/api/settings/api-keys", (_, res) => res.json(apiKeys));
app.post("/api/settings/api-keys", (req, res) => {
  const k = { id: uuidv4(), ...req.body, active: true, createdAt: new Date(), updatedAt: new Date() };
  apiKeys.push(k);
  res.json(k);
});
app.patch("/api/settings/api-keys/:id", (req, res) => {
  apiKeys = apiKeys.map(k => k.id === req.params.id ? { ...k, ...req.body, updatedAt: new Date() } : k);
  res.json(apiKeys.find(k => k.id === req.params.id));
});
app.delete("/api/settings/api-keys/:id", (req, res) => {
  apiKeys = apiKeys.filter(k => k.id !== req.params.id);
  res.sendStatus(204);
});
app.get("/api/settings/api-keys/use/:service", (req, res) => {
  const key = apiKeys.find(k => k.service === req.params.service && k.active);
  res.json({ key: key?.key || null });
});

app.listen(3030, () => console.log("Mock API rodando em http://localhost:3030"));
