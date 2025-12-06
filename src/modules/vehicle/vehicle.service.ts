import { pool } from "../../config/db";
import {
  ICreateVehicle,
  IUpdateVehicle,
} from "../../interfaces/vehicle.interface";

const createVehicle = async (body: ICreateVehicle) => {
  const {
    availability_status,
    daily_rent_price,
    registration_number,
    vehicle_name,
    type,
  } = body;

  const newVehicle = await pool.query(
    "INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );

  return newVehicle;
};

const findAllVehicles = async () => {
  const vehicles = await pool.query("SELECT * FROM vehicles");
  return vehicles;
};

const findVehicleById = async (id: number) => {
  const vehicle = await pool.query("SELECT * FROM vehicles WHERE id = $1", [
    id,
  ]);
  return vehicle;
};

const updateVehicle = async (id: number, body: IUpdateVehicle) => {
  const existingVehicle = await pool.query(
    "SELECT * FROM vehicles WHERE id = $1",
    [id]
  );

  if (existingVehicle.rows.length === 0) {
    throw new Error("Vehicle not found");
  }

  const updatedVehicle = { ...existingVehicle.rows[0], ...body };

  const result = await pool.query(
    "UPDATE vehicles SET vehicle_name = $1, type = $2, registration_number = $3, daily_rent_price = $4, availability_status = $5 WHERE id = $6 RETURNING *",
    [
      updatedVehicle.vehicle_name,
      updatedVehicle.type,
      updatedVehicle.registration_number,
      updatedVehicle.daily_rent_price,
      updatedVehicle.availability_status,
      id,
    ]
  );

  return result;
};

export const vehicleServices = {
  createVehicle,
  findAllVehicles,
  findVehicleById,
  updateVehicle,
};
