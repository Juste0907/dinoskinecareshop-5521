import { Link, useParams } from "wouter";
import { Loader2 } from "lucide-react";
import { CartDrawer, Footer, Header } from "../components/layout";
import { Seal } from "../components/brand";
import { useOrder } from "../queries/orders";
import { SHIPPING_METHODS, formatEuro } from "../../api/catalog";

export default function Merci() {
  const { number } = useParams<{ number: string }>();
  const order = useOrder(number);

  return (
    <div className="min-h-screen bg-lilac">
      <Header variant="lilac" />
      <main className="mx-auto max-w-[900px] px-5 pb-24 pt-10 md:px-10">
        {order.isLoading ? (
          <div className="grid h-80 place-items-center">
            <Loader2 className="size-8 animate-spin" />
          </div>
        ) : order.isError || !order.data ? (
          <div className="rounded-[25px] bg-white p-10 text-center">
            <p className="text-[24px] font-bold">Commande introuvable.</p>
            <Link to="/" className="mt-6 inline-flex rounded-[20px] bg-concord px-7 py-4 text-[18px] font-bold uppercase text-white">
              Retour à la boutique
            </Link>
          </div>
        ) : (
          <div className="bg-electric overflow-hidden rounded-[25px] text-white">
            <div className="flex flex-col items-start gap-6 p-8 md:flex-row md:items-center md:p-[50px]">
              <Seal tone="white" size={120} lines={["Merci", "!"]} className="wobble shrink-0" />
              <div>
                <p className="font-stamp text-[16px] uppercase">Commande {order.data.number}</p>
                <h1 className="mt-3 text-[40px] font-bold leading-[1.05] md:text-[60px] md:leading-[63px]">
                  Ton dino est en route, {order.data.firstName}.
                </h1>
                <p className="mt-3 text-[17px] leading-[1.6] text-white/90">
                  Confirmation envoyée à {order.data.email}. Expédition sous 24h via{" "}
                  {SHIPPING_METHODS.find((m) => m.id === order.data.shippingMethod)?.label}.
                </p>
              </div>
            </div>
            <div className="bg-white p-8 text-concord md:p-[50px]">
              <ul className="space-y-3">
                {order.data.items.map((i) => (
                  <li key={i.sizeId} className="flex justify-between text-[17px]">
                    <span className="font-semibold">
                      {i.quantity} × {i.name} {i.volume}
                    </span>
                    <span className="font-bold">{formatEuro(i.unitCents * i.quantity)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 space-y-1 border-t-2 border-dashed border-softgrape pt-4 text-[16px]">
                <div className="flex justify-between">
                  <span>Livraison</span>
                  <span>{order.data.shippingCents === 0 ? "Offerte" : formatEuro(order.data.shippingCents)}</span>
                </div>
                <div className="flex justify-between text-[24px] font-bold">
                  <span>Total</span>
                  <span>{formatEuro(order.data.totalCents)}</span>
                </div>
              </div>
              <p className="mt-6 text-[15px] leading-[1.6] text-concord/80">
                Livraison : {order.data.address}, {order.data.postalCode} {order.data.city}, {order.data.country}
              </p>
              <Link to="/" className="mt-8 inline-flex rounded-[20px] bg-concord px-7 py-4 text-[18px] font-bold uppercase leading-[20px] text-white">
                Retour à la boutique
              </Link>
            </div>
          </div>
        )}
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
