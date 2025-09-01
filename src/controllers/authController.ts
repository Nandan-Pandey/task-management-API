import type { Request, Response } from 'express';
import { getAllEmployeesService, loginUser } from '../services/authService';


interface LoginRequestBody {
  email: string;
  password: string;
}

export const login = async (req: Request<{}, {}, LoginRequestBody>, res: Response) => {
  try {
    const { email, password } = req.body;
    const data = await loginUser(email, password);
    res.json({ data });
  } catch (error) {
    res.status(401).json({ message: (error as Error).message });
  }
};


export const getAllEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await getAllEmployeesService();
    res.status(200).json({
      status: 200,
      success: true,
      data: employees,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: (error as Error).message,
    });
  }
};

