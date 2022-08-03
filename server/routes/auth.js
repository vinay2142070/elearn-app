import express from "express";
import { login, register, logout, currentUser, forgotPassword, resetPassword } from "../controllers/auth";
import { authenticate } from '../middlewares/authMiddleWare.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/logout', logout)
router.get('/current-user', authenticate, currentUser)
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router