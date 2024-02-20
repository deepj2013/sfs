import express from 'express';
import { cspLoginController, getCspDetailsController,updateCspDetailsController }from '../controllers/cspControllers.js';
import { cspAuth } from '../middlewares/cspauth.js';
const router = express.Router();



router.post('/login', cspLoginController )
router.get('/getDetails', [cspAuth], getCspDetailsController)
router.post('/cspupdateDetail', [cspAuth], updateCspDetailsController)

export default router;