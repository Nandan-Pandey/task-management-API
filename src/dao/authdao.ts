import { UserModel } from "../models/userModel";

export const findUserByEmail = async (email: string) => {
  try {
    console.log("Finding user by email:", email);
    return await UserModel.findOne({ email }).exec();
  } catch (error) {
    console.error("Error in findUserByEmail:", error);
    throw error; // let the service handle it
  }
};

export const getAllEmployeesDao = async () => {
  try {
    const employees = await UserModel.find({}, { _id: 1, name: 1 }).exec();
    return employees;
  } catch (error) {
    console.error("Error in getAllEmployeesDao:", error);
    throw new Error("Failed to fetch employees");
  }
};
