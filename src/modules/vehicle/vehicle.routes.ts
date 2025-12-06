import { Router } from "express";
import auth from "../../middlewares/auth";
import { vehicleControllers } from "./vehicle.controller";

const router = Router();

router.post("/", auth("admin"), vehicleControllers.createVehicle);
router.get("/", vehicleControllers.findAllVehicles);
router.get("/:id", vehicleControllers.findVehicleById);

export const vehicleRoutes = router;
