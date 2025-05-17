import express from 'express'
import userAuth from '../middleware/userAuth.js';
import { getUser } from '../controllers/getController.js';

const router2 = express.Router();

router2.get('/getData',userAuth,getUser);

export default router2;