import express from "express";
import { getAllUsers, getUser, updateUser, deleteUser } from "../controllers/UserController.js";
import { isAdmin, verifyToken } from "../middlewares/auth.js";
const router = express.Router();
router.get('/', [verifyToken, isAdmin], getAllUsers);
router.get('/:id', [verifyToken, isAdmin], getUser);
router.put('/:id', [verifyToken, isAdmin], updateUser);
router.delete('/:id', [verifyToken, isAdmin], deleteUser);
export default router;