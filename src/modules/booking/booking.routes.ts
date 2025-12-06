import { Router } from "express";
import auth from "../../middlewares/auth";
import { bookingControllers } from "./booking.controller";

const router = Router();

router.post("/", auth("admin", "customer"), bookingControllers.createBooking);
router.get("/", auth("admin", "customer"), bookingControllers.findAllBookings);
router.put(
  "/:bookingId",
  auth("admin", "customer"),
  bookingControllers.updateBooking
);

export const bookingRoutes = router;
