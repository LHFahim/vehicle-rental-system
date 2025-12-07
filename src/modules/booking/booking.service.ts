import { pool } from "../../config/db";
import {
  ICreateBooking,
  IUpdateBooking,
} from "../../interfaces/booking.interface";

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

  await pool.query(
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

const findAllBookings = async (email: string, role: string) => {
  if (role === "admin") {
    const adminData = [];

    const bookings = await pool.query("SELECT * FROM bookings");

    for (const booking of bookings.rows) {
      const vehicle = await pool.query("SELECT * FROM vehicles WHERE id = $1", [
        booking.vehicle_id,
      ]);

      const customer = await pool.query("SELECT * FROM users WHERE id = $1", [
        booking.customer_id,
      ]);

      adminData.push({
        ...booking,

        customer: {
          name: customer.rows[0].name,
          email: customer.rows[0].email,
        },

        vehicle: {
          vehicle_name: vehicle.rows[0].vehicle_name,
          registration_number: vehicle.rows[0].registration_number,
        },
      });
    }

    return adminData;
  }

  const user = await pool.query("SELECT id FROM users WHERE email = $1", [
    email,
  ]);

  const userId = user.rows[0].id;

  const bookings = await pool.query(
    "SELECT * FROM bookings WHERE customer_id = $1",
    [userId]
  );

  const data = [];

  for (const booking of bookings.rows) {
    const vehicle = await pool.query("SELECT * FROM vehicles WHERE id = $1", [
      booking.vehicle_id,
    ]);

    data.push({
      ...booking,
      vehicle: {
        vehicle_name: vehicle.rows[0].vehicle_name,
        registration_number: vehicle.rows[0].registration_number,
        type: vehicle.rows[0].type,
      },
    });
  }

  return data;
};

const updateBooking = async (
  bookingId: number,
  email: string,
  body: IUpdateBooking,
  isAdmin: boolean = false
) => {
  const booking = await pool.query("SELECT * FROM bookings WHERE id = $1", [
    bookingId,
  ]);

  if (!isAdmin) {
    const user = await pool.query("SELECT id FROM users WHERE email = $1", [
      email,
    ]);

    const userId = user.rows[0].id;

    if (booking.rows[0].customer_id !== userId) {
      throw new Error("Unauthorized to update this booking");
    }

    const result = await pool.query(
      "UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *",
      [body.status, bookingId]
    );

    // this was not mentioned in the instructions
    // logically, even if the user cancels the booking, the vehicle should become available again
    const updateVehicleStatus = await pool.query(
      `UPDATE vehicles SET availability_status = $1
    WHERE id = $2 RETURNING *`,
      ["available", booking.rows[0].vehicle_id]
    );

    return {
      result: result.rows[0],
      isCancelledByUser: true,
    };
  }

  const updatedBooking = await pool.query(
    "UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *",
    [body.status, bookingId]
  );

  const updateVehicleStatus = await pool.query(
    `UPDATE vehicles SET availability_status = $1
    WHERE id = $2 RETURNING *`,
    ["available", booking.rows[0].vehicle_id]
  );

  return {
    result: {
      ...updatedBooking.rows[0],
      vehicle: {
        availability_status: updateVehicleStatus.rows[0].availability_status,
      },
    },
    isCancelledByUser: false,
  };
};

export const bookingServices = {
  createBooking,
  findAllBookings,

  updateBooking,
};
