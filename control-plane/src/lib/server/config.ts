// API keys are sourced from .env. They live there under NEXT_PUBLIC_* names,
// so we fall back to those (the dedicated server names take precedence if set).
export const ENV = {
  repairdash: {
    base: process.env.REPAIRDASH_BASE_URL || '',
    key:  process.env.REPAIRDASH_API_KEY || process.env.NEXT_PUBLIC_REPAIRDASH_API_KEY || '',
  },
  driver: {
    base: process.env.DRIVERAPP_BASE_URL || '',
    key:  process.env.DRIVERAPP_API_KEY || process.env.NEXT_PUBLIC_DRIVER_KEY || '',
  },
  payments: {
    base: process.env.PAYMENTS_BASE_URL || '',
    key:  process.env.PAYMENTS_API_KEY || process.env.NEXT_PUBLIC_PAYMENT_KEY || '',
  },
  feedback: {
    base: process.env.FEEDBACK_BASE_URL || '',
    key:  process.env.FEEDBACK_API_KEY || process.env.NEXT_PUBLIC_FEEDBACK_API_KEY || '',
  },
  promociones: {
    base: process.env.PROMOCIONES_BASE_URL || '',
    key:  process.env.PROMOCIONES_API_KEY || process.env.NEXT_PUBLIC_PROMOTIONS_KEY || '',
  },
  actor: {
    clerkId: process.env.ACTOR_CLERK_ID || 'super_admin_control_plane',
    email:   process.env.ACTOR_EMAIL    || 'admin@control-plane.internal',
  },
};

export function rdHeaders()   { return { 'x-api-key': ENV.repairdash.key }; }
export function drHeaders()   { return { 'x-control-plane-api-key': ENV.driver.key }; }
export function pmHeaders()   { return { 'x-control-plane-api-key': ENV.payments.key }; }
export function fbHeaders()   { return { 'x-api-key': ENV.feedback.key }; }
export function promoHeaders(){ return { 'x-api-key': ENV.promociones.key }; }

export function actor() {
  return { actorClerkId: ENV.actor.clerkId, actorEmail: ENV.actor.email };
}

export function configured(base: string): boolean {
  return !!base;
}
