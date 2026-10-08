// Shared by the contact form and the /api/inquiry Worker so the allowed values cannot drift apart.
export const PRODUCT_OPTIONS = [
  "Surgical Consumables",
  "Orthopedic Products",
  "Rehabilitation Aids",
  "Hospital Disposables",
  "Infection Control Products",
  "Medical Accessories",
  "General / Multiple",
] as const;

export const LIMITS = { name: 120, organization: 160, email: 254, phone: 32, message: 4000 } as const;
