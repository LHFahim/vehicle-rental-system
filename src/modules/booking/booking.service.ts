import { pool } from "../../config/db";
import { ICreateBooking } from "../../interfaces/booking.interface";
import { IUpdateVehicle } from "../../interfaces/vehicle.interface";

const createBooking = async (body: ICreateBooking) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = body;

  const vehicle = await pool.query("SELECT * FROM vehicles WHERE id = $1", [
    vehicle_id,
  ]);

  if (vehicle.rows.length === 0) {
    throw new Error("Vehicle not found");
  }

  if (vehicle.rows[0].availability_status !== "available") {
    throw new Error("Vehicle is not available for booking");
  }

  const diffMs =
    new Date(rent_end_date).getTime() - new Date(rent_start_date).getTime();

  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  const totalPrice = diffDays * vehicle.rows[0].daily_rent_price;

  const newBooking = await pool.query(
    "INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    [
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      totalPrice,
      "active",
    ]
  );

  const updateVehicleStatus = await pool.query(
    "UPDATE vehicles SET availability_status = $1 WHERE id = $2 RETURNING *",
    ["booked", vehicle_id]
  );

  const res = {
    ...newBooking.rows[0],
    vehicle: {
      vehicle_name: vehicle.rows[0].vehicle_name,

      daily_rent_price: vehicle.rows[0].daily_rent_price,
    },
  };

  return res;
};

const findAllBookings = async () => {
  const bookings = await pool.query("SELECT * FROM bookings");
  return bookings;
};

const findBookingById = async (bookingId: number) => {
  const booking = await pool.query("SELECT * FROM bookings WHERE id = $1", [
    bookingId,
  ]);
  return booking;
};

const updateBooking = async (bookingId: number, body: IUpdateVehicle) => {
  const existingBooking = await pool.query(
    "SELECT * FROM bookings WHERE id = $1",
    [bookingId]
  );

  if (existingBooking.rows.length === 0) {
    throw new Error("Vehicle not found");
  }

  const updatedVehicle = { ...existingBooking.rows[0], ...body };

  const result = await pool.query(
    "UPDATE vehicles SET vehicle_name = $1, type = $2, registration_number = $3, daily_rent_price = $4, availability_status = $5 WHERE id = $6 RETURNING *",
    [
      updatedVehicle.vehicle_name,
      updatedVehicle.type,
      updatedVehicle.registration_number,
      updatedVehicle.daily_rent_price,
      updatedVehicle.availability_status,
      bookingId,
    ]
  );

  return result;
};

const deleteBooking = async (bookingId: number) => {
  const result = await pool.query(
    "DELETE FROM bookings WHERE id = $1 RETURNING *",
    [bookingId]
  );

  return (result.rowCount ?? 0) > 0;
};

export const vehicleServices = {
  createBooking,
  findAllBookings,
  findBookingById,
  updateBooking,
  deleteBooking,
};
