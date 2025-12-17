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
  createdAt: string;
  updatedAt?: string;
};

const readDataFile = async (): Promise<FormDataDB[]> => {
  try {
    const fileContent = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(fileContent);
  } catch {
    return [];
  }
};

// const validId = (req, res) => {
//   const id = Number(req.params.id);
//   if (Number.isNaN(id)) {
//     return res
//       .status(400)
//       .json({ success: false, error: "不正なIDが指定されました" });
//   }
// }

app.post("/api/data", async (req, res) => {
  try {
    const data = await readDataFile();

    const now = new Date().toISOString();
    // IDを自動生成
    const newData: FormDataDB = {
      id: Date.now(),
      ...req.body,
      createdAt: now,
      updatedAt: now,
    };

    data.push(newData);

    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));

    res.json({ success: true, message: "送信完了！", data: newData });
  } catch (error) {
    console.error("保存エラー:", error);
    res.status(500).json({ success: false, error: "送信失敗..." });
  }
});

app.get("/api/data", async (_req, res) => {
  try {
    const data = await readDataFile();
    res.json({ success: true, data });
  } catch (error) {
    console.error("読み込みエラー:", error);
    res.json({ success: true, data: [] });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.put("/api/data/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res
      .status(400)
      .json({ success: false, error: "不正なIDが指定されました" });
  }

  try {
    // 読む
    const data = await readDataFile();
    // 探す
    const index = data.findIndex((item) => item.id === id);

    if (index === -1) {
      return res
        .status(404)
        .json({ success: false, error: "データが見つかりません" });
    }
    // 特定・更新
    const existing = data[index];
    const updated: FormDataDB = {
      ...existing,
      ...req.body,
      // 変更したくない値を既存値でさらに上書き
      id,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };

    // 書く
    data[index] = updated;
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error("更新エラー:", error);
    res.status(500).json({ success: false, error: "更新に失敗しました" });
  }
});

app.delete("/api/data/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res
      .status(400)
      .json({ success: false, error: "不正なIDが指定されました" });
  }

  try {
    const data = await readDataFile();
    const index = data.findIndex((item) => item.id === id);
    if (index === -1) {
      return res
        .status(404)
        .json({ success: false, error: "データが見つかりません" });
    }

    const deleted = data[index];
    data.splice(index, 1);
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));

    res.json({ success: true, data: deleted });
  } catch (error) {
    console.error("削除エラー:", error);
    res.status(500).json({ success: false, error: "削除に失敗しました" });
  }
});
