import { Router } from "express";
import auth from "../../middlewares/auth";
import { userControllers } from "./user.controller";

const router = Router();

router.get("/", auth("admin"), userControllers.findAllUsers);
router.put("/:userId", auth("admin", "customer"), userControllers.updateUser);
router.delete("/:id", auth("admin", "customer"), userControllers.deleteUser);

export const userRoutes = router;
