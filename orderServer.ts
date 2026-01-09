import express from "express";
import cors from "cors";
import "dotenv/config";
import { pool } from "./db.js";
import { ResultSetHeader } from "mysql2";

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

const toMySqlDateTime = (iso: string) => iso.replace("T", " ").slice(0, 19);

app.post("/orders", async (req, res) => {
  let conn;
  try {
    const { items, subtotal, tax, total, createdAt } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, error: "itemsが不正です" });
    }

    conn = await pool.getConnection();
    await conn.beginTransaction();

    const created = toMySqlDateTime(createdAt ?? new Date().toISOString());

    const [result] = await conn.query<ResultSetHeader>(
      "INSERT INTO orders (subtotal, tax, total, created_at) VALUES (?, ?, ?, ?)",
      [subtotal, tax, total, created]
    );

    for (const item of items) {
      await conn.query(
        "INSERT INTO order_items (order_id, menu_id, name, qty, unit, unit_price, tax_rate, amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          result.insertId,
          item.menuId,
          item.name,
          item.qty,
          item.unit,
          item.unitPrice,
          item.taxRate,
          item.amount,
        ]
      );
    }

    await conn.commit();
    res.json({
      success: true,
      message: "送信完了！",
      orderId: result.insertId,
    });
  } catch (error) {
    if (conn) {
      await conn.rollback();
    }
    console.error("保存エラー:", error);
    res.status(500).json({ success: false, error: "送信失敗..." });
  } finally {
    if (conn) {
      try {
        conn.release();
      } catch (error) {
        console.error(error);
      }
    }
  }
});

app.listen(PORT, () => {
  console.log(`Order Server running on http://localhost:${PORT}`);
});
