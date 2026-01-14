import express from "express";
import cors from "cors";
import "dotenv/config";
import { pool } from "./db.js";
import { prisma } from "./src/lib/prisma.js";
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

app.get("/orders", async (_req, res) => {
  try {
    const orders = await prisma.orders.findMany({
      include: { order_items: true },
      orderBy: { id: "desc" },
    });

    const data = orders.map((order) => ({
      id: order.id,
      subtotal: order.subtotal,
      tax: order.tax,
      total: order.total,
      created_at: order.created_at,
      items: order.order_items.map((item) => ({
        itemId: item.id,
        menuId: item.menu_id,
        name: item.name,
        qty: item.qty,
        unit: item.unit,
        unitPrice: item.unit_price,
        taxRate: item.tax_rate,
        amount: item.amount,
      })),
    }));

    res.json({ success: true, data });
  } catch (error) {
    console.error("一覧取得エラー:", error);
    res.status(500).json({ success: false, error: "取得失敗..." });
  }
});

app.listen(PORT, () => {
  console.log(`Order Server running on http://localhost:${PORT}`);
});
