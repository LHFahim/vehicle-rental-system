import { Router } from "express";
import auth from "../../middlewares/auth";
import { vehicleControllers } from "./vehicle.controller";

const router = Router();

router.post("/", auth("admin"), vehicleControllers.createVehicle);
router.get("/", vehicleControllers.findAllVehicles);
router.get("/:vehicleId", vehicleControllers.findVehicleById);
router.put("/:vehicleId", auth("admin"), vehicleControllers.updateVehicle);
router.delete("/:vehicleId", auth("admin"), vehicleControllers.deleteVehicle);

export const vehicleRoutes = router;
