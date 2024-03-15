"use client";

import Link from "next/link";

export default function SuccessPage() {
  return (
    <div>
      <h1>Hotel Booking Payment Successful!</h1>
      <p>You will receive an email with your booking details</p>
      <Link href="/"
      >
        Go back to Homepage
      </Link>
    </div>
  );
}
