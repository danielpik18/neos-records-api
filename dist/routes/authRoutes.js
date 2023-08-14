import express from "express";
import { register, login, validateRefreshToken, deleteRefreshToken } from "../controllers/AuthController.js";
import { checkDuplicateEmail } from "../middlewares/auth.js";
const router = express.Router();
router.post('/register', checkDuplicateEmail, register);
router.post('/login', login);
router.post('/refresh_token', validateRefreshToken);
router.post('/logout', deleteRefreshToken);
export default router;