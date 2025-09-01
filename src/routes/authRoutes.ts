import { Router } from 'express';
import { getAllEmployees, login } from '../controllers/authController';


const router = Router();

router.post('/login', login);
router.post('/userMaster', getAllEmployees);

export default router;
