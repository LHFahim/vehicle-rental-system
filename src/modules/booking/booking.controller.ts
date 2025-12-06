import { Request, Response } from "express";
import { bookingServices } from "./booking.service";

const createBooking = async (req: Request, res: Response) => {
  try {
    const result = await bookingServices.createBooking(req.body);
    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const findAllBookings = async (req: Request, res: Response) => {
  try {
    const result = await bookingServices.findAllBookings(
      req?.user?.email,
      req?.user?.role
    );
    res.status(200).json({
      success: true,
      message: "Bookings retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: [],
    });
  }
};

const updateBooking = async (req: Request, res: Response) => {
  const bookingId = req.params.bookingId;

  try {
    const result = await bookingServices.updateBooking(
      bookingId as unknown as number,
      req?.user?.email,
      req.body,
      req?.user?.role === "admin"
    );

    res.status(200).json({
      success: true,
      message: result.isCancelledByUser
        ? "Booking cancelled successfully"
        : "Booking marked as returned. Vehicle is now available",
      data: result.result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const bookingControllers = {
  createBooking,
  findAllBookings,
  updateBooking,
};
