import express from "express";
import { createNewsItem, deleteNewsItem, getAllNews, getNewsItem, updateNewsItem } from "../controllers/NewsPostController.js";
import { isAdmin, verifyToken } from "../middlewares/auth.js";

const router = express.Router();

router.get('/', getAllNews)
router.get('/:id', getNewsItem)
router.post('/', [verifyToken, isAdmin], createNewsItem)
router.put('/:id', [verifyToken, isAdmin], updateNewsItem)
router.delete('/:id', [verifyToken, isAdmin], deleteNewsItem)

export default router;