import { findUserByEmail, getAllEmployeesDao } from "../dao/authdao";
import { comparePassword, generateToken } from "../utils/auth";
import { errorResponse, successResponse } from "../utils/resp";


interface User {
  _id: string | { toString(): string };
  password: string;
}

export const loginUser = async (email: string, password: string) => {
  try {
    const user = (await findUserByEmail(email)) as User | null;

    if (!user) {
      return errorResponse("Invalid Email", 401,user);
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return errorResponse("Invalid Password", 401,isMatch);
    }

    const token = generateToken(user._id.toString());
    return successResponse({ token }, "Login successful", 200);
  } catch (error: any) {
    console.error("Login error:", error);
    return errorResponse("Failed to login", 500, error);
  }
};

export const getAllEmployeesService = async () => {
  try {
    const employees = await getAllEmployeesDao();

    // Map to only id and name
    const formattedEmployees = employees.map((emp) => ({
      id: emp._id,
      name: emp.name,
    }));

    return successResponse(formattedEmployees, "Employees fetched successfully", 200);
  } catch (error: any) {
    console.error("Error in getAllEmployeesService:", error);
    return errorResponse("Failed to fetch employees", 500, error);
  }
};
