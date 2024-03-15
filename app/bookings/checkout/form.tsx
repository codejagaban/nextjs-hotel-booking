"use client";
import { loadStripe } from "@stripe/stripe-js";
import { FormEvent, useEffect } from "react";

type RoomType = {
  roomID: string;
  nights: string;
  checkInDate: string;
  checkOutDate: string;
  price: number;
  roomType: string,
};

export default function BookingForm({
  roomID,
  nights,
  price,
  checkInDate,
  checkOutDate,
  roomType
}: RoomType) {
  useEffect(() => {
    loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }, []);

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const bookingData = {
      check_in_date: checkInDate,
      check_out_date: checkOutDate,
      nights,
      room_id: roomID,
      price,
      roomType,
      first_name: formData.get("firstName") as string,
      last_name: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone_number: formData.get("phoneNumber") as string,
    };
    try {
      console.log({bookingData})
      const response = await fetch("/api/checkout-session", {
        method: "POST",
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        const payment = await response.json();
        window.location.href = payment.url;
      } else {
        console.error("Error submitting form:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <form onSubmit={handleFormSubmit}>
      <div>
        <label htmlFor="firstName">First Name</label>
        <input type="text" name="firstName" id="firstName" required />
      </div>
      <div>
        <label htmlFor="lastName">Last Name</label>
        <input type="text" name="lastName" id="lastName" required />
      </div>
      <div>
        <label htmlFor="email">Email Address</label>
        <input type="email" name="email" id="email" required />
      </div>
      <div>
        <label htmlFor="phoneNumber">Phone Number</label>
        <input type="text" name="phoneNumber" id="phoneNumber" required />
      </div>
      <div>
        <button type="submit">Book Room</button>
      </div>
    </form>
  );
}
