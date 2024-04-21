"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type DateState = Date | null;
export default function BookingForm() {
  const [startDate, setStartDate] = useState<DateState>(new Date());
  const [endDate, setEndDate] = useState<DateState>();
  const router = useRouter();
  const [error, setError] = useState("");

  const handleChange = (range: DateState[]) => {
    const [startDate, endDate] = range;
    setStartDate(startDate);
    setEndDate(endDate);
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    e.preventDefault()
    if (!endDate) {
    setError("Please add a check out date")
    } else {
      const checkAvailabilityData = {
        checkInDate: startDate,
        checkOutDate: endDate,
        capacity: formData.get("capacity")
      }
      router.push(`/bookings/rooms?checkInDate=${checkAvailabilityData.checkInDate}&checkOutDate=${checkAvailabilityData.checkOutDate}&capacity=${checkAvailabilityData.capacity}`)
    }
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <div>
        <h2>Book an Hotel Room</h2>
        <input type="number" name="capacity" />;
        <div>
          <div>
            <label htmlFor="checkInDate"> Check-in and Check-out Date:</label>
            {error && <span>{ error }</span>}
            <DatePicker
              selected={startDate}
              onChange={handleChange}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              withPortal
              required
            />
          </div>
          <div>
            <label htmlFor="capacity"> Guest(s):</label>
            <input
              type="number"
              name="capacity"
              defaultValue={1}
              min={1}
              max={6}
            />
          </div>
        </div>

        <button type="submit">Check Availability </button>
      </div>
    </form>
  );
}
