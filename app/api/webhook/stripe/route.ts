import { NextResponse } from "next/server";
import Stripe from "stripe";
import { makeReservation } from "@/lib/apis";

const checkout_session_completed = "checkout.session.completed";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request, res: Response) {
  const reqBody = await req.text();
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret) return;
    event = stripe.webhooks.constructEvent(reqBody, sig, webhookSecret);
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: `Webhook Error: ${error.message}` },
      { status: 500 }
    );
  }

  // load our event
  switch (event.type) {
    case checkout_session_completed:
      const session = event.data.object;
      if (!session.metadata || !session.payment_intent) {
        console.error("Missing metadata or Payment Intent in Stripe session");
        // Optionally return an error response
        return NextResponse.json(
          { message: "Incomplete reservation data" },
          { status: 400 }
        );
      }

      const {
        // @ts-ignore
        metadata: {
          first_name,
          last_name,
          email,
          phone_number,
          check_in_date,
          check_out_date,
          room_id,
          nights,
          total_price,
        },
        payment_intent,
      } = session;
      console.log({ payment_intent });
      await makeReservation({
        first_name,
        last_name,
        email,
        phone_number,
        check_in_date,
        check_out_date,
        room_id,
        nights,
        total_price,
        payment_id: payment_intent as string,
      });

      return NextResponse.json("Booking successful", {
        status: 200,
        statusText: "Booking Successful",
      });

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ message: "Event Received" }, { status: 200 });
}
