import type { Request, Response } from 'express';
import { getAllEmployeesService, loginUser } from '../services/authService';




export const login = async (req: any,  res: any) => {
  try {
    const { email, password } = req.body;
    const data:any = await loginUser(email, password);

    return res.status(data.status).json({
      success: data.success,
      message: data.message || 'Login successful',
      data: data.data || null,   // use `data.data` from successResponse/errorResponse
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: (error as Error).message });
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

