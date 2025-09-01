import { findUserByEmail, getAllEmployeesDao } from "../dao/authdao";
import { comparePassword, generateToken } from "../utils/auth";


interface User {
  _id: string | { toString(): string };
  password: string;
  // add other user fields if needed
}

export const loginUser = async (email: string, password: string) => {
  const user = await findUserByEmail(email) as User;
  
 if (!user) { return { status: 401, message: 'Invalid Email' }; }
  const isMatch = await comparePassword(password, user.password); 
  if (!isMatch) { return { status: 401, message: 'Invalid Pasword' }; }
   const token = generateToken(user._id.toString()); return { status: 200, token }
 };


 export const getAllEmployeesService = async () => {
  const employees = await getAllEmployeesDao();
  return employees.map(emp => ({
    id: emp._id,
    name: emp.name,
  }));
};

