import express from 'express'
const router = express.Router();
import { register,login,logout, sendVerifyOpt, verifyEmail, isAuthenticated, resetPassword, sendResetOtp } from '../controllers/userController.js';
import userAuth from '../middleware/userAuth.js';

router.post('/register',register);
router.post('/login',login);
router.post('/logout',logout);
router.post('/send-verify-otp',userAuth,sendVerifyOpt);
router.post('/verify-account',userAuth,verifyEmail);
router.get('/is-auth',userAuth,isAuthenticated);
router.post('/send-reset-otp',sendResetOtp);
router.post('/reset-password',resetPassword);




export default router;