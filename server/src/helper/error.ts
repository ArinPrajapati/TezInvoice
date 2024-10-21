import { Express, Response } from "express";
const _500 = (message: string, errorMessage: string, res: Response) => {
  return res.status(500).json({
    message: message,
    error: errorMessage || "Internal Server Error",
    remark: "Ahh!!! , I did not expect that to happen!! 😑 😑",
  });
};

export { _500 };
