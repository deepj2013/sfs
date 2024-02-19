import express from 'express';
import {adminSignupController, adminLoginController, genCspController,activateCspController }from '../controllers/adminControllers.js';
import { adminAuth } from '../middlewares/adminauth.js';
const router = express.Router();


router.post('/adminsignup', adminSignupController);
router.post('/adminlogin', adminLoginController);
router.post('/gencsp', [adminAuth], genCspController )
router.post('/activatecsp', [adminAuth], activateCspController )




export default router;