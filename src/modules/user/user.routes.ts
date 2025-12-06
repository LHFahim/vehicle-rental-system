import { Router } from "express";
import auth from "../../middlewares/auth";
import { userControllers } from "./user.controller";

const router = Router();

router.get("/", auth("admin", "customer"), userControllers.findAllUsers);
router.put("/:id", auth("admin", "customer"), userControllers.updateUser);

export const userRoutes = router;
