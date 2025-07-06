import { sql } from "../config/db.js";

export async function getTransactionByUserId(req, res) {
  try {
    const { userId } = req.params;

    const transactions = await sql`
      SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC;
    `;

    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error getting the transaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function createTransaction(req, res) {
  try {
    const { user_id, title, amount, category, transaction_type } = req.body;

    if (!user_id || !title || !transaction_type || !category || amount === undefined) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const transaction = await sql`
      INSERT INTO transactions (user_id, title, amount, category, transaction_type)
      VALUES (${user_id}, ${title}, ${amount}, ${category}, ${transaction_type})
      RETURNING *;
    `;

    res.status(201).json(transaction[0]);
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function deleteTransaction(req, res) {
  try {
    const { id } = req.params;

    if (isNaN(parseInt(id))) {
      return res.status(400).json({ error: "Invalid transaction ID" });
    }

    const result = await sql`
      DELETE FROM transactions WHERE id = ${id} RETURNING *;
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted successfully", transaction: result[0] });
  } catch (error) {
    console.error("Error deleting the transaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getSummaryByUserId(req, res) {
  try {
    const { user_id } = req.params;

    const balanceResult = await sql`
      SELECT COALESCE(SUM(amount), 0) as balance
      FROM transactions
      WHERE user_id = ${user_id} AND transaction_type = 'income';
    `;

    const expensesResult = await sql`
      SELECT COALESCE(SUM(amount), 0) as expenses
      FROM transactions
      WHERE user_id = ${user_id} AND amount < 0;
    `;

    const incomeResult = await sql`
      SELECT COALESCE(SUM(amount), 0) as income
      FROM transactions
      WHERE user_id = ${user_id} AND amount > 0;
    `;

    res.status(200).json({
      balance: balanceResult[0].balance,
      expenses: expensesResult[0].expenses,
      income: incomeResult[0].income,
    });
  } catch (error) {
    console.error("Error getting the transaction summary:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
