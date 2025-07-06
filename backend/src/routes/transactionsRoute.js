import express from 'express';
import {
  createTransaction,
  deleteTransaction,
  getTransactionByUserId,
  getSummaryByUserId,
} from '../controllers/transactionsController.js';

const router = express.Router();

router.get("/:userId", getTransactionByUserId);
router.post("/", createTransaction); // ✅ Accepts POST request to /api/transactions
router.delete("/:id", deleteTransaction);
router.get("/summary/:user_id", getSummaryByUserId);

export default router;

