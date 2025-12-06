import { Router } from "express";
import auth from "../../middlewares/auth";
import { bookingControllers } from "./booking.controller";

const router = Router();

router.post("/", auth("admin", "customer"), bookingControllers.createBooking);
router.get("/", auth("admin", "customer"), bookingControllers.findAllBookings);
// router.get("/:bookingId", bookingControllers.findBookingById);
// router.put("/:bookingId", auth("admin"), bookingControllers.updateBooking);
// router.delete("/:bookingId", auth("admin"), bookingControllers.deleteBooking);
export const bookingRoutes = router;
