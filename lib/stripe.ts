import { Stripe } from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
  apiVersion: "2023-08-16", // Specifies the API version
  typescript: true, // Indicates the usage of TypeScript
});
