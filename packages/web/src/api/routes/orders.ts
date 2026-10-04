import { z } from "zod";
import { eq } from "drizzle-orm";
import { ORPCError } from "@orpc/server";
import { base } from "../__core/app";
import { db } from "../database";
import * as schema from "../database/schema";
import { SHIPPING_METHODS, shippingCost, sizeById, type ShippingId } from "../catalog";

const createInput = z.object({
  email: z.string().email(),
  firstName: z.string().min(1).max(80),
  lastName: z.string().min(1).max(80),
  address: z.string().min(3).max(200),
  city: z.string().min(1).max(100),
  postalCode: z.string().min(3).max(12),
  country: z.string().min(2).max(60),
  phone: z.string().max(30).optional(),
  shippingMethod: z.enum(SHIPPING_METHODS.map((m) => m.id) as [ShippingId, ...ShippingId[]]),
  items: z
    .array(z.object({ sizeId: z.string(), quantity: z.number().int().min(1).max(20) }))
    .min(1),
});

function orderNumber() {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `DINO-${n}`;
}

export const orders = {
  create: base.input(createInput).handler(async ({ input }) => {
    // Prices are always computed server-side from the catalog.
    const items = input.items.map((i) => {
      const size = sizeById(i.sizeId);
      if (!size) throw new ORPCError("BAD_REQUEST", { message: `Format inconnu : ${i.sizeId}` });
      return {
        sizeId: size.id,
        name: size.name,
        volume: size.volume,
        quantity: i.quantity,
        unitCents: size.priceCents,
      };
    });
    const subtotalCents = items.reduce((t, i) => t + i.unitCents * i.quantity, 0);
    const shippingCents = shippingCost(input.shippingMethod, subtotalCents);
    const [order] = await db
      .insert(schema.orders)
      .values({
        number: orderNumber(),
        email: input.email,
        firstName: input.firstName,
        lastName: input.lastName,
        address: input.address,
        city: input.city,
        postalCode: input.postalCode,
        country: input.country,
        phone: input.phone || null,
        shippingMethod: input.shippingMethod,
        items,
        subtotalCents,
        shippingCents,
        totalCents: subtotalCents + shippingCents,
      })
      .returning();
    return order;
  }),
  get: base.input(z.object({ number: z.string() })).handler(async ({ input }) => {
    const [order] = await db
      .select()
      .from(schema.orders)
      .where(eq(schema.orders.number, input.number));
    if (!order) throw new ORPCError("NOT_FOUND", { message: "Commande introuvable" });
    return order;
  }),
};
