import express from "express";
import cors from "cors";
import "dotenv/config";
import { pool } from "./db.js";
import { ResultSetHeader } from "mysql2";
import type { RowDataPacket } from "mysql2/promise";

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
    const [rows] = await pool.query(`
      SELECT
        o.id, o.subtotal, o.tax, o.total, o.created_at,
        COALESCE((
          SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
              'itemId', i.id,
              'menuId', i.menu_id,
              'name', i.name,
              'qty', i.qty,
              'unit', i.unit,
              'unitPrice', i.unit_price,
              'taxRate', i.tax_rate,
              'amount', i.amount
            )
          )
          FROM order_items i
          WHERE i.order_id = o.id
        ), JSON_ARRAY()) AS items
      FROM orders o
      ORDER BY o.id DESC;
    `);

    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("一覧取得エラー:", error);
    res.status(500).json({ success: false, error: "取得失敗..." });
  }
});

app.get("/orders/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id))
      return res.status(400).json({ success: false, error: "不正なIDです" });

    const [orders] = await pool.query<RowDataPacket[]>(
      "SELECT id, subtotal, tax, total, created_at FROM orders WHERE id = ?",
      [id]
    );
    if (orders.length === 0) return res.status(404).json({ success: false });

    const [items] = await pool.query<RowDataPacket[]>(
      "SELECT id AS itemId, menu_id AS menuId, name, qty, unit, unit_price AS unitPrice, tax_rate AS taxRate, amount FROM order_items WHERE order_id = ? ORDER BY id",
      [id]
    );

    res.json({ success: true, order: orders[0], items });
  } catch (error) {
    res.status(500).json({ success: false });
    console.error(error);
  }
});

app.put("/orders/:id", async (req, res) => {
  let conn;
  // 1) id / body 検証
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id))
      return res.status(400).json({ success: false, error: "不正なIDです" });

    const { items, subtotal, tax, total } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, error: "itemsが不正です" });
    }
    // 2) beginTransaction
    conn = await pool.getConnection();
    await conn.beginTransaction();
    // 3) UPDATE orders
    const [updateResult] = await conn.query<ResultSetHeader>(
      "UPDATE orders SET subtotal = ?, tax = ?, total = ? WHERE id = ?",
      [subtotal, tax, total, id]
    );

    if (updateResult.affectedRows === 0) {
      await conn.rollback();
      return res
        .status(404)
        .json({ success: false, error: "注文が見つかりません" });
    }
    // 4) DELETE order_items
    await conn.query("DELETE FROM order_items WHERE order_id = ?", [id]);
    // 5) INSERT order_items (loop)
    for (const item of items) {
      await conn.query(
        "INSERT INTO order_items (order_id, menu_id, name, qty, unit, unit_price, tax_rate, amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          id,
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
    // 6) commit + res
    await conn.commit();
    res.json({ success: true, orderId: id });
  } catch (error) {
    // rollback + 500
    if (conn) {
      await conn.rollback();
    }
    console.error("更新エラー:", error);
    res.status(500).json({ success: false, error: "更新失敗..." });
  } finally {
    // release
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
