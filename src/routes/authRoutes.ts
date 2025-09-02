import { Router } from 'express';
import {getAllEmployeesController , login } from '../controllers/authController';


const router = Router();

router.post('/login', login);
router.get('/userMaster', getAllEmployeesController);

export default router;
