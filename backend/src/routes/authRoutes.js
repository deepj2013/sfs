import express from 'express';
import {cspCreateController }from '../controllers/authControllers.js';

const router = express.Router();


router.post('/reqcspcenter', cspCreateController);




export default router;