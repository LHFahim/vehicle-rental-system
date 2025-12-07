import { Request, Response } from "express";
import { vehicleServices } from "./vehicle.service";

const createVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.createVehicle(req.body);

    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const findAllVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.findAllVehicles();
    res.status(200).json({
      success: true,
      message:
        (result.rowCount ?? 0) > 0
          ? "Vehicles retrieved successfully"
          : "No vehicles found",
      data: (result.rowCount ?? 0) > 0 ? result.rows : [],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const findVehicleById = async (req: Request, res: Response) => {
  const vehicleId = req.params.vehicleId;

  try {
    const result = await vehicleServices.findVehicleById(
      vehicleId as unknown as number
    );
    res.status(200).json({
      success: true,
      message: "Vehicle retrieved successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateVehicle = async (req: Request, res: Response) => {
  const vehicleId = req.params.vehicleId;

  try {
    const result = await vehicleServices.updateVehicle(
      vehicleId as unknown as number,
      req.body
    );
    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteVehicle = async (req: Request, res: Response) => {
  const vehicleId = req.params.vehicleId;

  try {
    const result = await vehicleServices.deleteVehicle(
      vehicleId as unknown as number
    );
    if (result === true)
      res.status(200).json({
        success: true,
        message: "Vehicle deleted successfully",
      });
    else
      res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const vehicleControllers = {
  createVehicle,
  findAllVehicles,
  findVehicleById,
  updateVehicle,
  deleteVehicle,
};
