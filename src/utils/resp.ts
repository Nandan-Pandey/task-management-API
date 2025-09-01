
export const successResponse = (data: any, message = "Success", status = 200) => {
  return {
    status,
    success: true,
    message,
    data
  };
};

export const errorResponse = (message = "Error", status = 400, details?: any) => {
  return {
    status,
    success: false,
    message,
    error: details
  };
};
