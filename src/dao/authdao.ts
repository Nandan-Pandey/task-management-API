import { UserModel } from "../models/userModel";


export const findUserByEmail = async (email: string) => {
    console.log("Finding user by email:", email);
  return await UserModel.findOne({ email }).exec();
};


export const getAllEmployeesDao = async () => {
  return await UserModel.find({}, { _id: 1, name: 1 }).exec();
};