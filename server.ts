import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import { FormDataType } from "./src/components/pages/form/Form.schema.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const DATA_FILE = path.join(__dirname, "data.json");

app.use(cors());
app.use(express.json());

type FormDataDB = FormDataType & {
  id: number;
  createdAt: Date;
  updatedAt: Date;
};

app.post("/api/data", async (req, res) => {
  try {
    // 既存データを読み込み
    let data: FormDataDB[] = [];
    try {
      const fileContent = await fs.readFile(DATA_FILE, "utf-8");
      data = JSON.parse(fileContent);
    } catch {
      // ファイルが存在しない場合は空配列
    }

    // IDを自動生成
    const newData = {
      id: Date.now(),
      ...req.body,
      createdAt: new Date().toISOString(),
    };

    data.push(newData);

    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));

    res.json({ success: true, message: "送信完了！" });
  } catch (error) {
    console.error("保存エラー:", error);
    res.status(500).json({ success: false, error: "送信失敗..." });
  }
});

app.get("/api/data", async (req, res) => {
  try {
    const fileContent = await fs.readFile(DATA_FILE, "utf-8");
    const data = JSON.parse(fileContent);
    res.json({ success: true, data });
  } catch (error) {
    console.error("読み込みエラー:", error);
    res.json({ success: true, data: [] });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
