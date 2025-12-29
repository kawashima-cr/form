import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3002;
const DATA_FILE = path.join(__dirname, "orderData.json");

app.use(cors());
app.use(express.json());

const readDataFile = async () => {
  try {
    const fileContent = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(fileContent);
  } catch {
    return [];
  }
};

app.post("/orders", async (req, res) => {
  try {
    const data = await readDataFile();

    const newData = {
      ...req.body,
      createdAt: req.body.createdAt ?? new Date().toISOString(),
    };

    data.push(newData);

    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));

    res.json({ success: true, message: "送信完了！", data: newData });
  } catch (error) {
    console.error("保存エラー:", error);
    res.status(500).json({ success: false, error: "送信失敗..." });
  }
});

app.listen(PORT, () => {
  console.log(`Order Server running on http://localhost:${PORT}`);
});
