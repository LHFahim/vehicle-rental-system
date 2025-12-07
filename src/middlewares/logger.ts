import { Request, Response } from "express";

const logger = (req: Request, res: Response, next: Function) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}\n`);

  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}\n`);
  next();
};

export default logger;
