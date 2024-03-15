import { Stripe, loadStripe } from '@stripe/stripe-js';

export const getStripe = () => {
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
  );

  return stripePromise;
};