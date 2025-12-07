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

const findVehicleById = async (vehicleId: number) => {
  const vehicle = await pool.query("SELECT * FROM vehicles WHERE id = $1", [
    vehicleId,
  ]);
  return vehicle;
};

const updateVehicle = async (vehicleId: number, body: IUpdateVehicle) => {
  const existingVehicle = await pool.query(
    "SELECT * FROM vehicles WHERE id = $1",
    [vehicleId]
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
      vehicleId,
    ]
  );

  return result;
};

const deleteVehicle = async (vehicleId: number) => {
  const activeBookings = await pool.query(
    `SELECT * FROM bookings WHERE vehicle_id = $1 AND status = $2`,
    [vehicleId, "active"]
  );

  if (activeBookings.rows.length > 0) {
    throw new Error("Cannot delete vehicle with active bookings");
  }

  const result = await pool.query(
    "DELETE FROM vehicles WHERE id = $1 RETURNING *",
    [vehicleId]
  );

  return (result.rowCount ?? 0) > 0;
};

export const vehicleServices = {
  createVehicle,
  findAllVehicles,
  findVehicleById,
  updateVehicle,
  deleteVehicle,
};
