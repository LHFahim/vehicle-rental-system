import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const config = {
  DB_URL: process.env.DB_URL,
  PORT: process.env.PORT || 5000,
  SECRET: process.env.SECRET,
};

export default config;
