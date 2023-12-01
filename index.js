const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

const rooms = [];
const bookings = [];

// 1. Creating a Room
app.post("/api/rooms", (req, res) => {
  const { numberOfSeats, amenities, pricePerHour } = req.body;
  const newRoom = {
    numberOfSeats: 50,
    amenities: "projector,chairs",
    pricePerHour: 500,
    roomId: rooms.length + 1,
  };
  rooms.push(newRoom);
  res.status(201).json(newRoom);
});

// 2. Booking a Room
app.post("/api/bookings", (req, res) => {
  const { customerName, date, startTime, endTime, roomId } = req.body;
  const newBooking = {
    customerName: "vignesh",
    date: "2023-12-01",
    startTime: "09:00",
    endTime: "12:00",
    roomId: "room_id_here",
    bookingId: bookings.length + 1,
    bookingDate: new Date().toISOString(),
  };
  bookings.push(newBooking);
  res.status(201).json(newBooking);
});

// 3. List all Rooms with Booked Data
app.get("/api/allRoomsBookings", (req, res) => {
  const allRoomsBookings = rooms.map((room) => {
    const bookedStatus = bookings.some(
      (booking) => booking.roomId === room.roomId
    );
    const bookedData = bookedStatus
      ? bookings.filter((booking) => booking.roomId === room.roomId)
      : [];
    return {
      Room_Name: `Room ${room.roomId}`,
      Booked_Status: bookedStatus,
      Booked_Data: bookedData,
    };
  });
  res.status(200).json(allRoomsBookings);
});

// 4. List all customers with booked Data
app.get("/api/allCustomersBookedData", (req, res) => {
  const allCustomersBookedData = bookings.map((booking) => {
    const room = rooms.find((room) => room.roomId === booking.roomId);

    // Check if the room object exists before accessing its properties
    if (room) {
      return {
        Customer_Name: booking.customerName,
        Room_Name: `Room ${room.roomId}`,
        Date: booking.date,
        Start_Time: booking.startTime,
        End_Time: booking.endTime,
      };
    } else {
      return {
        Customer_Name: booking.customerName,
        Room_Name: `Room Not Found`, // Providing a default message when the room is not found
        Date: booking.date,
        Start_Time: booking.startTime,
        End_Time: booking.endTime,
      };
    }
  });
  res.status(200).json(allCustomersBookedData);
});

// 5. List how many times a customer has booked the room
app.get("/api/customerBookings", (req, res) => {
  const customerName = req.query.customerName;
  const customerBookings = bookings.filter(
    (booking) => booking.customerName === customerName
  );
  res.status(200).json(customerBookings);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
