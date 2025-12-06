import { pool } from "../../config/db";
import { ICreateVehicle } from "../../interfaces/vehicle.interface";

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

export const vehicleServices = {
  createVehicle,
  findAllVehicles,
  findVehicleById,
};
