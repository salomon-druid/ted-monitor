import Stripe from 'stripe';

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (_stripe) return _stripe;
  
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY must be set');
  }
  
  _stripe = new Stripe(key, {
    apiVersion: '2026-03-25.dahlia',
  });
  return _stripe;
}

// Price IDs — configure in Stripe Dashboard and add here
export const PLANS = {
  starter: {
    name: 'Starter',
    priceId: process.env.STRIPE_PRICE_STARTER || '',
    price: 79,
    features: [
      '100 notices/month',
      '5 CPV alerts',
      'Basic Bid-Fit scoring',
      'Email notifications',
      '1 user',
    ],
  },
  professional: {
    name: 'Professional',
    priceId: process.env.STRIPE_PRICE_PROFESSIONAL || '',
    price: 199,
    features: [
      'Unlimited notices',
      '25 CPV alerts',
      'AI summaries',
      'Email + Slack alerts',
      '5 users',
      'CSV/PDF export',
    ],
  },
  enterprise: {
    name: 'Enterprise',
    priceId: process.env.STRIPE_PRICE_ENTERPRISE || '',
    price: 499,
    features: [
      'Everything in Professional',
      'Unlimited users',
      'API access',
      'Custom integrations',
      'Dedicated support',
      'White-label option',
    ],
  },
} as const;

export type PlanKey = keyof typeof PLANS;
