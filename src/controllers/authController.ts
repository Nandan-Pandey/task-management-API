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
    return res.status(data.status).json({
      success: data.success,
      message: data.message || 'Login successful',
      status: data.status || 200,
      data: data || null,  
    
    });;
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};


export const getAllEmployeesController = async (req: Request, res: Response) => {
  try {
    const employeesResponse = await getAllEmployeesService();

    // Send response as-is
    return res.status(employeesResponse.status).json(employeesResponse);
  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: (error as Error).message,
      data: null,
    });
  }
};

