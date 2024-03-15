import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
type RequestData = {
  first_name: string,
  last_name: string,
  email: string,
  phone_number: string,
  check_in_date: string,
  check_out_date: string,
  room_id: string,
  nights: number,
  total_price: string,
  roomType: string,
  price: number;
};
export async function POST(req: Request) {
  const {
    price,
    roomType,
    room_id,
    nights,
    check_in_date,
    check_out_date,
    first_name,
    last_name,
    phone_number,
    email,
  }: RequestData = await req.json();
  const totalPrice = price * 100;
  try {
    // Create Checkout Sessions from body params.
    const stripeSession = await stripe.checkout.sessions.create({
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            product_data: {
              name: roomType,
              description: `Payment for ${nights} Night(s)`
            },
            unit_amount: totalPrice,
          },
        },
      ],
      mode: "payment",
      success_url: `${process.env.APP_URL}/bookings/success`,
      cancel_url: `${process.env.APP_URL}/bookings/checkout?checkInDate=${check_in_date}&checkOutDate=${check_out_date}&roomType=${roomType}&price=${price/nights}&room=${room_id}`,
      metadata: {
        nights,
        total_price: totalPrice,
        room_id,
        check_in_date,
        check_out_date,
        first_name,
        last_name,
        phone_number,
        email,
      },
    });
    console.log(stripeSession);
    return NextResponse.json({ url: stripeSession.url! });
  } catch (err) {
    console.log({ err });
    return NextResponse.json(
      { message: "An expected error occurred, please try again" },
      { status: 500 }
    );
  }
}
