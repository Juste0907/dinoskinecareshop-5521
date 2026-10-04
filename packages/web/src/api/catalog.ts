// Shared product catalog — imported by both the API (price authority) and the web UI.
export type SizeId = "bebe" | "dino" | "trex";

export interface ProductSize {
  id: SizeId;
  name: string;
  volume: string;
  ml: number;
  priceCents: number;
  compareAtCents?: number;
  tagline: string;
  image: string;
  badge?: string;
  reviews: number;
}

export const PRODUCT = {
  name: "La Gelée Dino",
  subtitle: "Sérum-gelée hydratant éclat",
};

export const SIZES: ProductSize[] = [
  {
    id: "bebe",
    name: "Bébé Dino",
    volume: "30 ml",
    ml: 30,
    priceCents: 1490,
    tagline: "Le format voyage, pour tester ou glisser dans le sac.",
    image: "/images/size-30.png",
    reviews: 412,
  },
  {
    id: "dino",
    name: "Dino",
    volume: "100 ml",
    ml: 100,
    priceCents: 2900,
    compareAtCents: 3400,
    tagline: "Le classique. Trois mois de peau rebondie.",
    image: "/images/size-100.png",
    badge: "Best-seller",
    reviews: 1683,
  },
  {
    id: "trex",
    name: "T-Rex",
    volume: "200 ml",
    ml: 200,
    priceCents: 4500,
    compareAtCents: 5800,
    tagline: "Format géant, à partager (ou pas).",
    image: "/images/size-200.png",
    badge: "-22%",
    reviews: 236,
  },
];

export const SHIPPING_METHODS = [
  { id: "standard", label: "Colissimo", eta: "3–5 jours ouvrés", priceCents: 490 },
  { id: "express", label: "Express Chronopost", eta: "24h", priceCents: 990 },
] as const;

export type ShippingId = (typeof SHIPPING_METHODS)[number]["id"];

export const FREE_SHIPPING_FROM = 3500;

export function sizeById(id: string) {
  return SIZES.find((s) => s.id === id);
}

export function shippingCost(method: ShippingId, subtotalCents: number) {
  const m = SHIPPING_METHODS.find((s) => s.id === method) ?? SHIPPING_METHODS[0];
  if (m.id === "standard" && subtotalCents >= FREE_SHIPPING_FROM) return 0;
  return m.priceCents;
}

export function formatEuro(cents: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(cents / 100);
}
